from fastapi import FastAPI, File, UploadFile
from typing import Annotated
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.post("/files")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}

@app.post("/uploadFile")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}

@app.post("/uploadFiles/")
async def create_upload_files(files: list[UploadFile]):
    return {"filenames": [file.filename for file in files]}



@app.get("/")
async def main():
    content = """
<body>
<form action="/uploadFiles/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    """
    return HTMLResponse(content=content)
