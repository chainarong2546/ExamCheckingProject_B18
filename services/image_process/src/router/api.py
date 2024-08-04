from fastapi import APIRouter, File, UploadFile
from typing import Annotated
from fastapi.responses import HTMLResponse


router = APIRouter()


@router.get("")
async def root_route():
    return {
        "success": True,
        "msg": "image process service",
    }


@router.get("/form")
async def main():
    content = """
<body>
<h1>Test</h1>
<form action="/uploadFiles/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    """
    return HTMLResponse(content=content)


@router.get("/files")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@router.post("/files")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@router.post("/uploadFile")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}


@router.post("/uploadFiles")
async def create_upload_files(files: list[UploadFile]):
    return {"filenames": [file.filename for file in files]}
