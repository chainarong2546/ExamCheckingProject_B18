import filetype
from models.dataClass import Result_CheckFileType

def checkFileType(
    file: bytes
) -> Result_CheckFileType | None :
    """ รับไฟล์เข้ามาและหาว่าคือไฟล์ประเภทอะไร

    Args:
        file (bytes): ไฟล์ประเภท bytes

    Returns:
        (Result_CheckFileType | None): คืนค่า Result_CheckFileType ถ้าหาประเภทไฟล์ได้ ถ้าหาไม่ได้จะคือค่า None
    """
    
    file_bytes = None
    if isinstance(file, bytes) :
        file_bytes = file

    # ตรวจสอบประเภทของไฟล์จาก bytes
    try :
        type = filetype.guess(file_bytes)
        if type is None:
            return None
        else:
            return Result_CheckFileType(
                mime = type.mime,
                extension = type.extension
            )
    except :
        return None
      

