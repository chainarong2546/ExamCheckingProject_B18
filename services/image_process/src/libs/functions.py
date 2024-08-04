# python module
import io
import os
import datetime

# third party module
import pymupdf
import cv2
import numpy as np
import PIL.Image
import filetype

# your local module
import services.image_process.src.config.config as config
import services.image_process.src.libs.model as model



def checkFileType(
    file: os.PathLike | bytes | io.BytesIO
) -> model.Result_CheckFileType | None :
    """ รับไฟล์เข้ามาและหาว่าคือไฟล์ประเภทอะไร

    Args:
        file (os.PathLike | bytes | io.BytesIO): ที่อยู่ไฟล์ภายในเครื่อง หรือ ไฟล์ประเภท bytes

    Returns:
        model.Result_CheckFileType | None: คืนค่า model.Result_CheckFileType ถ้าหาประเภทไฟล์ได้ ถ้าหาไม่ได้จะคือค่า None
    """

    file_bytes = None
    if isinstance(file, bytes) :
        file_bytes = file
    elif isinstance(file, io.BytesIO) :
        file_bytes = file.read()
    else :
        try :
            with open(file, 'rb') as f:
                file_bytes = f.read()
        except :
            pass

    # ตรวจสอบประเภทของไฟล์จาก bytes
    type = filetype.guess(file_bytes)
    if type is None:
        return None
    else:
        return model.Result_CheckFileType(
            mime = type.mime,
            extension = type.extension
        )


def pdfExtractImages(
    pdf_file: bytes | io.BytesIO
) -> list[model.MetaImage]:
    """ ดึงรูปภาพทั้งหมดออกมาจากไฟล์ PDF

    Args:
        pdf_file (bytes | io.BytesIO): เนื้อหาของไฟล์

    Raises:
        TypeError: ไม่สามารถหาประเภทไฟล์
        TypeError: ไฟล์ไม่ใช่ประเภท PDF

    Returns:
        list[model.MetaImage]: รายการรูปภาพทั้งหมด
    """
    
    file_type = checkFileType(file=pdf_file)
    if file_type is None :
        raise TypeError("Unable to find file type.")
    elif file_type.extension != "pdf" :
        raise TypeError("File is not PDF type.")

    # เปิดไฟล์ PDF
    doc = pymupdf.open(stream = pdf_file, filetype = "pdf")
    
    images_list = []
    
    # วนลูปในแต่ละหน้า
    for page_num in range(len(doc)):
        page = doc.load_page(page_id=page_num)
        images = page.get_images()
        
        # วนลูปภาพทั้งหมดในแต่ละหน้า
        for image_index, img in enumerate(images):
            xref = img[0]  # หมายเลขของรูปภาพ
            base_image = doc.extract_image(xref=xref)

            images_list.append(
                model.MetaImage(
                    page = page_num + 1,
                    index = image_index,
                    bytes = base_image["image"],  # ข้อมูลรูปภาพ
                    ext = base_image["ext"],  # ประเภทรูปภาพ (เช่น 'jpeg') สามารถใช้เป็นนามสกุลไฟล์รูปภาพได้
                    colorspace = base_image["colorspace"],  # colorspace ของภาพ (1 คือ Gray, 3 คือ RGB, 4 คือ CMYK)
                    cs_name = base_image["cs-name"],  # ชื่อของ colorspace (คือ DeviceGray, DeviceRGB, DeviceCMYK)
                    width = base_image["width"],  # ความกว้างของภาพ
                    height = base_image["height"],  # ความสูงของภาพ
                    xres = base_image["xres"],  # ความละเอียดในทิศทาง x (dpi)
                    yres = base_image["yres"],  # ความละเอียดในทิศทาง y (dpi)
                    cal_xres = int((base_image["width"] / int(page.mediabox_size.x)) * 72),  # 72 เป็นค่า DPI พื้นฐานของ PDF
                    cal_yres =int((base_image["height"] / int(page.mediabox_size.y)) * 72)
                )
            )
    return images_list


def saveMetaImage(
    meta_img: model.MetaImage,
    save_path: str | os.PathLike
) -> model.Result_SaveMetaImage:
    """ บันทึกรูปภาพลงไปที่เครื่อง

    Args:
        meta_img (model.MetaImage): รูปภาพที่ต้องหารบันทึก
        save_path (str | os.PathLike): ที่อยู่โฟลเดอร์ภายในเครื่องที่ต้องการบันทึก

    Raises:
        TypeError: พารามิเตอร์ meta_img ไม่ใช่ประเภท model.MetaImage

    Returns:
        model.Result_SaveMetaImage: รายละเอียดผลการบันทึก
    """

    if not isinstance(meta_img, model.MetaImage) :
        raise TypeError("The `meta_img` parameter is not MetaImage.")

    date_time_now = datetime.datetime.now().strftime(r"%H%M%S%f")
    img_name = f"{date_time_now}.{meta_img.ext}"

    img = bytesImageTocv2MatLike(meta_img.bytes)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_img = PIL.Image.fromarray(img_rgb)
    pil_img.save(fp=os.path.join(save_path,img_name), format=meta_img.ext, dpi=(meta_img.xres, meta_img.yres))

    return model.Result_SaveMetaImage(
        img_name = f"{img_name}",
        img_path = f"{save_path}",
        msg = f"file '{img_name}' saved at {save_path}"
    )


def bytesImageTocv2MatLike(  
    img: bytes | io.BytesIO
) -> cv2.typing.MatLike :
    """ แปลงรูปที่อยู่ในรูปแบบ bytes ให้อยู่ในรูป MatLike

    Args:
        img (bytes | io.BytesIO): เนื้อหารูปภาพ

    Returns:
        cv2.typing.MatLike: วัตถุรูปภาพในรูปแบบ MatLike
    """

    image = None
    if isinstance(img, io.BytesIO) :
        image = img.read()
    elif isinstance(img, bytes) :
        image = img
    else :
        raise TypeError("The `img` parameter is not byte or of `io.BytesIO.")

    # แปลง bytes stream เป็น numpy array
    nparr = np.frombuffer(image, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def resizeMaintainAspectRatioByWidth(
    image: cv2.typing.MatLike,
    new_width: int 
) -> cv2.typing.MatLike :
    """ ปรับขนาดความกว้างรูปภาพโดยที่รักษาอัตราส่วน

    Args:
        image (cv2.typing.MatLike): วัตถุรูปภาพในรูปแบบ MatLike
        new_width (int): ความกว้างที่ต้องการ

    Returns:
        cv2.typing.MatLike: วัตถุรูปภาพในรูปแบบ MatLike ที่ปรับขนาดแล้ว
    """

    (h, w) = image.shape[:2]
    aspect_ratio = new_width / float(w)
    new_height = int(h * aspect_ratio)
    return cv2.resize(image, (new_width, new_height))

            
def resizeMaintainAspectRatioByHeight(
    image: cv2.typing.MatLike,
    new_height: int
) -> cv2.typing.MatLike :
    """ ปรับขนาดความสูงรูปภาพโดยที่รักษาอัตราส่วน

    Args:
        image (cv2.typing.MatLike): วัตถุรูปภาพในรูปแบบ MatLike
        new_height (int): ความสูงที่ต้องการ

    Returns:
        cv2.typing.MatLike: วัตถุรูปภาพในรูปแบบ MatLike ที่ปรับขนาดแล้ว
    """

    (h, w) = image.shape[:2]
    aspect_ratio = new_height / float(h)
    new_width = int(w * aspect_ratio)
    return cv2.resize(image, (new_width, new_height))


def readFileAsBytesIO(
    file_path: os.PathLike
) -> io.BytesIO:
    """ อ่านไฟล์จากที่อยู่และส่งคืนในรูปแบบ io.BytesIO

    Args:
        file_path (os.PathLike): ที่อยู่ไฟล์ภายในเครื่อง

    Returns:
        io.BytesIO: เนื้อหาไฟล์ที่อถูกเปิด
    """
    with open(file_path, 'rb') as file:
        file_bytes = file.read()
    return io.BytesIO(file_bytes)
    

def pilImageTocv2MatLike(
    img: PIL.Image.Image
) -> cv2.typing.MatLike :
    """ แปลงรูป PIL.Image ให้อยู่ในรูป MatLike

    Args:
        img (PIL.Image.Image): วัตถุรูปภาพในรูปแบบ PIL.Image

    Returns:
        cv2.typing.MatLike: วัตถุรูปภาพในรูปแบบ MatLike
    """

    img_array = np.asarray(img)
    return cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)


# =========================================================================


def checkCompatibilityAndAdjustImage(
    img = cv2.typing.MatLike
) -> cv2.typing.MatLike | None:
    
    mark_center = []
    image = resizeMaintainAspectRatioByHeight(img, config.BASEIMAGE_HIGHT)

    kernel = np.asarray([
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],np.uint8)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, mono = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
    opening = cv2.morphologyEx(mono, cv2.MORPH_OPEN, kernel)
    blurred = cv2.GaussianBlur(opening, (3, 3), 0)
    f_image = blurred.copy()

    for mark in config.COMPATIBILITY_CHECK_AREA :

        # กำหนดพิกัดของมุมบนซ้ายและมุมล่างขวาของพื้นที่ที่ต้องการตรวจสอบ (ROI)
        top_left, bottom_right = mark[0], mark[1]

        # คำนวณความกว้าง (w) และความสูง (h) จากพิกัดที่ให้มา
        x, y = top_left
        w = bottom_right[0] - top_left[0]
        h = bottom_right[1] - top_left[1]

        # สร้างรูปภาพใหม่ที่เป็นพื้นที่ที่กำหนด
        roi = f_image[y:y+h, x:x+w]
        _, roi = cv2.threshold(roi, 180, 255, cv2.THRESH_BINARY)

        # เบลอ ROI เพื่อลดสัญญาณรบกวน
        blurred = cv2.GaussianBlur(roi, (3, 3), 0)

        # ใช้การหาขอบโดยใช้ Canny edge detection
        edged = cv2.Canny(blurred, 50, 150)

        # หาขอบเขตเส้นรอบรูปใน ROI โดยใช้ findContours
        contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # ตัวแปรเก็บจุดกึ่งกลางตามจำนวนสี่เหลี่ยม
        list_center = []

        # กรองหาเส้นรอบรูปที่มีลักษณะเป็นสี่เหลี่ยม
        for contour in contours:
            epsilon = 0.02 * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)

            if len(approx) == 4:

                # เลื่อนพิกัดกลับไปตาม ROI
                approx = approx.reshape((4, 2))
                approx += [x, y]

                # หาจุดกึ่งกลางของสี่เหลี่ยม
                center_x = int(np.mean(approx[:, 0]))
                center_y = int(np.mean(approx[:, 1]))
                center = [center_x, center_y]
                list_center.append(center)


                cv2.rectangle(f_image, top_left, bottom_right, (0, 255, 0), 1)

            else :
                
                approx += [x, y]
                # วาดเส้นรอบรูปสี่เหลี่ยมบนรูปภาพเดิม
                # cv2.drawContours(image, [approx], -1, (0, 255, 0), 3)
                cv2.rectangle(f_image, top_left, bottom_right, (0, 0, 255), 1)

        # ถ้ามีเครื่องหมายสี่เหลี่ยมหนึ่งอันถือว่าจุดนี้ผ่าน
        if len(list_center) == 1 :
            mark_center.append(list_center[0])


    # ถ้าผ่านครบทุกจุด
    if len(mark_center) == len(config.COMPATIBILITY_CHECK_AREA) :
        
        # พิกัดของมุมทั้งสี่ของรูปภาพที่ไม่ใช่มุมฉาก
        pts1 = np.float32(mark_center)

        # พิกัดของมุมทั้งสี่ของรูปภาพที่เป็นสี่เหลี่ยมมุมฉากที่ต้องการแปลง
        pts2: np.ndarray = np.float32(config.MARK_CENTER_LIST)

        # คำนวณ Matrix สำหรับการเปลี่ยนแปลง
        matrix: np.ndarray = cv2.getPerspectiveTransform(pts1, pts2)

        # ทำการแปลงภาพ
        warped_image = cv2.warpPerspective(image, matrix, image.shape[:2][::-1])


        return warped_image
    
    else :
        # ถ้าไม่ผ่านคืนค่า None

        cv2.imshow("img", f_image)
        cv2.waitKey(0)
        return None

