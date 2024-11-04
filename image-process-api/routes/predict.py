import base64
import cv2
import numpy as np
import json
from typing import List
from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from utils.bytesImageTocv2MatLike import bytesImageTocv2MatLike
from utils.detect_circles_in_rectangle import detect_circles_in_rectangle
from models.dataClass import Answer, ForCheckMarkerForCreateTemplate, Point, Square
from tasks import process_predict_task
from celery.result import AsyncResult

predict_router = APIRouter()


@predict_router.post("/predict")
async def predict( 
    image: UploadFile = File(...),
    template_answer: str = Form(...),
    template_std_id: str = Form(...),
    answer: str = Form(...),
    template_marker: str = Form(...),
    template_marker_center: str = Form(...),
):
    image_content = await image.read()
    img = bytesImageTocv2MatLike(image_content)
    img = cv2.resize(img, (848, 1200))
    if img is None:
        return JSONResponse(content={
            "success": False,
            "message": "Failed to read image"
        }, status_code=400)

    template_answer_json: List[List[Square]] = json.loads(template_answer)
    template_std_id_json: List[Square] = json.loads(template_std_id)
    answer_json: List[Answer] = json.loads(answer)
    template_marker_json: List[Square] = json.loads(template_marker)
    template_marker_center_json: List[Point] = json.loads(template_marker_center)
    
    blur_range = [3, 5, 7, 9, 11, 13]
    tl = ForCheckMarkerForCreateTemplate(supported=False, center=None)
    tr = ForCheckMarkerForCreateTemplate(supported=False, center=None)
    bl = ForCheckMarkerForCreateTemplate(supported=False, center=None)
    br = ForCheckMarkerForCreateTemplate(supported=False, center=None)
    
    for blur in blur_range :
        tl = detect_circles_in_rectangle(img, (template_marker_json['marker_tl']['sx'], template_marker_json['marker_tl']['sy']), (template_marker_json['marker_tl']['ex'], template_marker_json['marker_tl']['ey']), blur)
        tr = detect_circles_in_rectangle(img, (template_marker_json['marker_tr']['sx'], template_marker_json['marker_tr']['sy']), (template_marker_json['marker_tr']['ex'], template_marker_json['marker_tr']['ey']), blur)
        bl = detect_circles_in_rectangle(img, (template_marker_json['marker_bl']['sx'], template_marker_json['marker_bl']['sy']), (template_marker_json['marker_bl']['ex'], template_marker_json['marker_bl']['ey']), blur)
        br = detect_circles_in_rectangle(img, (template_marker_json['marker_br']['sx'], template_marker_json['marker_br']['sy']), (template_marker_json['marker_br']['ex'], template_marker_json['marker_br']['ey']), blur)
    
        if tl.supported and tr.supported and bl.supported and br.supported :
            break

    if not (tl.supported and tr.supported and bl.supported and br.supported) :
        return JSONResponse(
            content = {
                "success": False,
                "message": "Unable to find all four corner marks of the paper."
            },
            status_code = 400
        )
    
    # พิกัดของมาร์คทั้ง 4 จุดในภาพที่ตรวจจับได้ (ตามลำดับ: บนซ้าย, บนขวา, ล่างขวา, ล่างซ้าย)
    detected_points = np.array([[tl.center.x, tl.center.y], [tr.center.x, tr.center.y], [br.center.x, br.center.y], [bl.center.x, bl.center.y]], dtype=np.float32)

    # พิกัดของมาร์คทั้ง 4 จุดในต้นฉบับ (ตามลำดับ: บนซ้าย, บนขวา, ล่างขวา, ล่างซ้าย)
    reference_points = np.array([[template_marker_center_json["marker_tl_center"]["x"], template_marker_center_json["marker_tl_center"]["y"]], [template_marker_center_json['marker_tr_center']["x"], template_marker_center_json['marker_tr_center']["y"]], [template_marker_center_json['marker_br_center']["x"], template_marker_center_json['marker_br_center']["y"]], [template_marker_center_json['marker_bl_center']["x"], template_marker_center_json['marker_bl_center']["y"]]], dtype=np.float32)

    # คำนวณเมทริกซ์การเปลี่ยนมุมมอง (Perspective Transformation Matrix)
    matrix = cv2.getPerspectiveTransform(detected_points, reference_points)
    
    # ขนาดของภาพต้นฉบับ
    height, width = img.shape[:2]

    # ใช้เมทริกซ์ที่คำนวณได้ทำการเปลี่ยนมุมมองภาพให้ตรงกับต้นฉบับ
    warped_img = cv2.warpPerspective(img, matrix, (width, height))

    # ทำการแปลง `warped_img` เป็น bytes ก่อนส่งให้ Celery
    _, buffer = cv2.imencode('.jpg', warped_img)
    warped_img_bytes = base64.b64encode(buffer).decode('utf-8')

    task = process_predict_task.delay(
        warped_img = warped_img_bytes, 
        template_answer_json = template_answer_json, 
        template_std_id_json = template_std_id_json, 
        answer_json = answer_json,
    )
    
    # ส่งคืน task_id ให้ผู้ใช้เพื่อติดตามสถานะงาน
    return JSONResponse(
        content={
            "success": True,
            "message": "Add task success",
            "data": {
                "task_id": task.id
            }
        }
    )


@predict_router.get("/predict/status/{task_id}")
async def get_predict_status(task_id: str):
    task_result = AsyncResult(task_id)
    
    if task_result.state == 'PENDING':
        return JSONResponse(
            content={"status": task_result.state}
        )
    elif task_result.state == 'SUCCESS':
        return JSONResponse(
            content={"status": task_result.state, "result": task_result.result}
        )
    elif task_result.state == 'FAILURE':
        return JSONResponse(
            content={"status": task_result.state, "result": str(task_result.info)}  # ส่งคืนข้อผิดพลาด
        )
    else:
        return JSONResponse(
            content={"status": task_result.state}
        )
        



