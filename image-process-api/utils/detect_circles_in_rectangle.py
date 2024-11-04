# pass, don't edit
import cv2
import numpy as np

from models.dataClass import ForCheckMarkerForCreateTemplate, Point
from utils.bytesImageTocv2MatLike import bytesImageTocv2MatLike

def detect_circles_in_rectangle(image: cv2.typing.MatLike, top_left: Point, bottom_right: Point, blur_size: int):

    img = cv2.resize(image, (848, 1200))

    # แปลงเป็นภาพขาวดำ
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # เบลอภาพเพื่อลด noise
    gray_blurred = cv2.GaussianBlur(gray, (blur_size, blur_size), 3)
    
    # สร้าง mask สำหรับสี่เหลี่ยม
    mask = np.zeros_like(gray_blurred)
    cv2.rectangle(mask, top_left, bottom_right, 255, -1)
    
    # ใช้ mask ในการปิดบางส่วนของภาพที่อยู่นอกสี่เหลี่ยม
    masked_image = cv2.bitwise_and(gray_blurred, mask)

    # ใช้ HoughCircles เพื่อค้นหาวงกลม
    circles = cv2.HoughCircles(masked_image, cv2.HOUGH_GRADIENT, dp=1.7, minDist=100, param1=50, param2=20, minRadius=5, maxRadius=15)

    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        if len(circles) == 1:
            circle = circles[0]
            # แปลงค่าเป็น Python int
            center_point = Point(x=int(circle[0]), y=int(circle[1]))
            return ForCheckMarkerForCreateTemplate(supported=True, center=center_point)
    
    return ForCheckMarkerForCreateTemplate(supported=False, center=None)

