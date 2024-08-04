# For more information, please refer to https://aka.ms/vscode-docker-python
# FROM python:3.12.4-alpine3.20
FROM tensorflow/tensorflow:2.17.0-gpu

EXPOSE 8000

WORKDIR /app

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "src.server:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]