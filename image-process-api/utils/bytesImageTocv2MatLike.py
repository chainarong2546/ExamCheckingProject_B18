import cv2
import numpy as np

def bytesImageTocv2MatLike(  
    img: bytes
) -> cv2.typing.MatLike :
    """ แปลงรูปที่อยู่ในรูปแบบ bytes ให้อยู่ในรูป MatLike

    Args:
        img (bytes): เนื้อหารูปภาพ

    Returns:
        (cv2.typing.MatLike | None): วัตถุรูปภาพในรูปแบบ MatLike หรือคืนค่า None ถ้า img ไม่ใช้ bytes
    """

    if isinstance(img, bytes) :
        # แปลง bytes stream เป็น numpy array
        nparr = np.frombuffer(img, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return image
    else :
        return None
