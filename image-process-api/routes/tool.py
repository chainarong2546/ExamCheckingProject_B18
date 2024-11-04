import pymupdf
import base64
import json
import cv2
import numpy as np
from io import BytesIO
from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from utils.checkFileType import checkFileType
from utils.bytesImageTocv2MatLike import bytesImageTocv2MatLike
from utils.detect_circles_in_rectangle import detect_circles_in_rectangle
from models.dataClass import Point, Square, ReturnDataCheckMarkerForCreateTemplate, ForCheckMarkerForCreateTemplate
from dataclasses import asdict


tool_router = APIRouter()


# pass
@tool_router.post("/convertImageForCreateTemplate")
async def convertImageForCreateTemplate(file: UploadFile = File(...)):
    try:
        if file.content_type != 'application/pdf':
            return JSONResponse(status_code=400, content={
                "success": False,
                "error": "File must be a PDF"
            })

        # อ่านไฟล์ PDF
        pdf_bytes = await file.read()
        pdf_document = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        
        # นับจำนวนหน้า
        total_pages = pdf_document.page_count
        if total_pages != 1 :
            return JSONResponse(status_code=400, content={
                "success": False,
                "error": "The number of pages of the pdf must be 1 page."
            })

        # แปลง PDF เป็นรูปภาพ
        page = pdf_document.load_page(0)  # โหลดหน้าแรก (index 0)
        pix = page.get_pixmap(dpi=150)  # แปลงเป็นภาพ
        img_data = pix.tobytes("jpg")  # แปลงเป็น jpg
        
        # ส่งภาพกลับไปเป็น StreamingResponse
        return StreamingResponse(BytesIO(img_data), media_type="image/jpeg")
    except :
        return JSONResponse(status_code=500, content={
                "success": False,
                "error": "Server Error"
            })


# pass
@tool_router.post("/checkMarkerForCreateTemplate")
async def checkMarkerForCreateTemplate(
    file: UploadFile = File(...),
    marker_tl: str = Form(...),
    marker_tr: str = Form(...),
    marker_bl: str = Form(...),
    marker_br: str = Form(...)
):
    try:
        # อ่านไฟล์ที่อัปโหลด
        file_contents = await file.read()
        file_type = checkFileType(file_contents)
        if file_type is None:
            return JSONResponse(status_code=500, content={
                "success": False,
                "error": "File not supported"
            })
            
            
        img = bytesImageTocv2MatLike(file_contents)
        if img is None:
            return None

        
        # แปลงข้อมูล JSON ที่ถูกส่งมาเป็น Square object
        marker_tl_square: Square = Square(**json.loads(marker_tl))
        marker_tr_square: Square = Square(**json.loads(marker_tr))
        marker_bl_square: Square = Square(**json.loads(marker_bl))
        marker_br_square: Square = Square(**json.loads(marker_br))
        
        
        blur_range = [3, 5, 7, 9, 11, 13]
        tl = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        tr = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        bl = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        br = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        
        for blur in blur_range :
            # ตรวจจับวงกลมในแต่ละพิกัด
            tl = detect_circles_in_rectangle(img, (marker_tl_square.sx, marker_tl_square.sy), (marker_tl_square.ex, marker_tl_square.ey), blur)
            tr = detect_circles_in_rectangle(img, (marker_tr_square.sx, marker_tr_square.sy), (marker_tr_square.ex, marker_tr_square.ey), blur)
            bl = detect_circles_in_rectangle(img, (marker_bl_square.sx, marker_bl_square.sy), (marker_bl_square.ex, marker_bl_square.ey), blur)
            br = detect_circles_in_rectangle(img, (marker_br_square.sx, marker_br_square.sy), (marker_br_square.ex, marker_br_square.ey), blur)
            
        # สร้างโครงสร้างข้อมูลเพื่อตอบกลับ
        returnData = ReturnDataCheckMarkerForCreateTemplate(
            marker_tl=tl,
            marker_tr=tr,
            marker_bl=bl,
            marker_br=br
        )

        # ส่งคืนข้อมูล JSON ที่ตรวจจับได้
        return JSONResponse(status_code=200, content={
            "success": True,
            "data": asdict(returnData)  # แปลงเป็น dict ก่อนส่งคืน
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False,
            "error": f"Server Error: {str(e)}"
        })



# pass
@tool_router.post("/checkCompatibilityAndAdjustImageForUploadFileAtGroup")
async def checkCompatibilityAndAdjustImageForUploadFileAtGroup(
    marker_tl_square: Optional[str] = Form(None),
    marker_tr_square: Optional[str] = Form(None),
    marker_bl_square: Optional[str] = Form(None),
    marker_br_square: Optional[str] = Form(None),
    marker_qr_square: Optional[str] = Form(None),
    marker_qr_data: Optional[str] = Form(""),
    marker_tl_center: Optional[str] = Form(None),
    marker_tr_center: Optional[str] = Form(None),
    marker_bl_center: Optional[str] = Form(None),
    marker_br_center: Optional[str] = Form(None),
    image_data_url: str = Form(...),  # รับ base64 ของภาพ
):
    try:
        # ตรวจสอบและแปลง base64 เป็น bytes image
        image_data = image_data_url.split(",")[1]  # ตัดข้อมูล header ของ base64 ออก
        image_bytes = base64.b64decode(image_data)

        img = bytesImageTocv2MatLike(image_bytes)
        if img is None:
            return None


        # แปลงข้อมูล JSON ที่ถูกส่งมาเป็น Square object
        marker_tl: Square = Square(**json.loads(marker_tl_square))
        marker_tr: Square = Square(**json.loads(marker_tr_square))
        marker_bl: Square = Square(**json.loads(marker_bl_square))
        marker_br: Square = Square(**json.loads(marker_br_square))
        marker_qr: Square = Square(**json.loads(marker_qr_square))
        
        marker_tl_center2: Point = Point(**json.loads(marker_tl_center))
        marker_tr_center2: Point = Point(**json.loads(marker_tr_center))
        marker_bl_center2: Point = Point(**json.loads(marker_bl_center))
        marker_br_center2: Point = Point(**json.loads(marker_br_center))
        
        blur_range = [3, 5, 7, 9, 11, 13]
        tl = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        tr = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        bl = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        br = ForCheckMarkerForCreateTemplate(supported=False, center=None)
        
        for blur in blur_range :
            tl = detect_circles_in_rectangle(img, (marker_tl.sx, marker_tl.sy), (marker_tl.ex, marker_tl.ey), blur)
            tr = detect_circles_in_rectangle(img, (marker_tr.sx, marker_tr.sy), (marker_tr.ex, marker_tr.ey), blur)
            bl = detect_circles_in_rectangle(img, (marker_bl.sx, marker_bl.sy), (marker_bl.ex, marker_bl.ey), blur)
            br = detect_circles_in_rectangle(img, (marker_br.sx, marker_br.sy), (marker_br.ex, marker_br.ey), blur)
        
            if tl.supported and tr.supported and bl.supported and br.supported :
                break
        
        # สร้างโครงสร้างข้อมูลเพื่อตอบกลับ
        returnData = ReturnDataCheckMarkerForCreateTemplate(
            marker_tl=tl,
            marker_tr=tr,
            marker_bl=bl,
            marker_br=br
        )

        # ส่งคืนข้อมูล JSON ที่ตรวจจับได้
        return JSONResponse(status_code=200, content={
            "success": True,
            "data": asdict(returnData)  # แปลงเป็น dict ก่อนส่งคืน
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False,
            "error": f"Server Error: {str(e)}"
        })



@tool_router.post("/transform")
async def predict( 
    image: UploadFile = File(...),
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
    _, encoded_image  = cv2.imencode('.jpg', warped_img)

    
    # ส่งภาพกลับไปเป็น StreamingResponse
    return StreamingResponse(BytesIO(encoded_image.tobytes()), media_type="image/jpeg")
    

