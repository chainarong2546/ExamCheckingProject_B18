from dataclasses import dataclass

@dataclass
class Result_CheckFileType :
    mime: str
    extension: str

@dataclass
class Answer :
    a: bool
    b: bool
    c: bool
    d: bool
    all: bool
    point: int

@dataclass
class Point :
    x: int
    y: int

@dataclass
class Square :
    sx: int
    sy: int
    ex: int
    ey: int

@dataclass
class ForCheckMarkerForCreateTemplate :
    supported: bool
    center: Point
     

@dataclass
class ReturnDataCheckMarkerForCreateTemplate :
    marker_tl: ForCheckMarkerForCreateTemplate
    marker_tr: ForCheckMarkerForCreateTemplate
    marker_bl: ForCheckMarkerForCreateTemplate
    marker_br: ForCheckMarkerForCreateTemplate
