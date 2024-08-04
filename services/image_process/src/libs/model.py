import pathlib
from dataclasses import dataclass
from pydantic import BaseModel


@dataclass
class MetaImage:
    page: int
    index: int
    bytes: bytes
    ext: str
    colorspace: int # (1, 3, 4)
    cs_name: str # (DeviceGray, DeviceRGB, DeviceCMYK)
    width: int
    height: int
    xres: int
    yres: int
    cal_xres: int
    cal_yres: int


@dataclass
class Result_SaveMetaImage :
    img_name: str = None
    img_path: str | pathlib.PurePath = None
    msg: str = None


@dataclass
class Result_CheckFileType :
    mime: str
    extension: str


@dataclass
class RectangularBox :
    sx: int
    sy: int
    ex: int
    ey: int



# ======================================
# Fast API Model
class Item(BaseModel):
    name: str
    description: str | None
    price: float
    tax: float | None
