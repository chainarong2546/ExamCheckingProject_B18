
# Image size
BASEIMAGE_HIGHT = 1200

# Area for tracking marks (top_left, top_right, bottom_left, bottom_right)
COMPATIBILITY_CHECK_AREA = [
    (
        (30+20,273), (66+20,309)  # (x1,y1), (x2,y2)  Coordinates: top_left, bottom_right
    ),
    (
        (786,273), (821,309)
    ),
    (
        (30+20,1004-50), (66+20,1040-50)
    ),
    (
        (786,1004-50), (821,1040-50)
    )
]

# The center point of the check mark (top_left, top_right, bottom_left, bottom_right)
MARK_CENTER_LIST = [
    (70, 290),
    (802, 290),
    (70, 970),
    (802, 970)
]