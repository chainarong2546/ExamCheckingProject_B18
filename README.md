# ระบบตรวจสอบข้อสอบแบบมีหลายตัวเลือกด้วยเทคนิคการเรียนรู้เชิงลึก วิชาการเขียนโปรแกรมคอมพิวเตอร์ สำหรับสาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี

## เกี่ยวกับโครงการ

โครงการนี้เป็นโครงการที่พัฒนาขึ้นเพื่อใช้เป็นปริญานิพนสำหรับประกอบการเรียนของทางคณะผู้จัดทำ ในสาขาวิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลับเทคโนโลยีราชมงคลธัญบุรี

### วัตถุประสงค์

1. เพื่อพัฒนาเว็บแอปพลิเคชันตรวจข้อสอบปรนัยแบบเลือกตอบ
2. เพื่อลดภาระการตรวจข้อสอบปรนัยของอาจารย์ผู้สอน
3. เพื่อเพิ่มความรวดเร็วในการตรวจข้อสอบ

## รายละเอียด

### การแบ่งระบบออกเป็นบริการย่อยๆ

| Service Name          | Host Port | Container Port | Folder                | Description                                         |
| --------------------- | --------: | :------------- | --------------------- | --------------------------------------------------- |
| frontend-service      |         - | 3000           | service/frontend      | Frontend service run with `Next.JS`                 |
| user-service          |         - | 3000           | service/user          | User service run with `Express.JS`                  |
| image-storage-service |         - | 3000           | service/image-storage | Image Storage service run with `Express.JS`         |
| image-process-service |         - | 8000           | service/image-process | Image Process service run with `Python` + `FastAPI` |
| database-service      |         - | 3000           | service/database      | Database service run with `Express.JS`              |
| nginx                 |    80 443 | 80 443         | nginx                 | Load balance and Proxies run with `Nginx`           |
| postgressql           |      5432 | 5432           | postgressql           | Database run with `Postgresql`                      |
| redis                 |      6379 | 6379           | redis                 |                                                     |

### เอกสารประกอบอื่นๆ

เร็วๆนี้

## วิธีติดตั้ง

เนื่องจากโครงการใช้สภาพแวดล้อมในการพัฒนาผ่าน Docker ฉะนั้นการติดตั้งสามารถทำได้โดยการรันคำสั่งต่อไปนี้ในใต้รูทโฟลเดอร์

### Production

เปลี่ยน `dockerfile` ในไฟล์ compose.yaml เป็น `Dockerfile`

``` CLI
docker compose up --build
```

### Development

เปลี่ยน `dockerfile` ในไฟล์ compose.yaml เป็น `Dockerfile_Dev`

``` CLI
docker compose up --build
```

## การสร้างฐานข้อมูลครั้งแรก

เร็วๆนี้

## คณะผู้จัดทำ

1. นายชัยณรงค์ คงพล
2. นายรณกฤต เหลืองอ่อน
3. นายกฤตมุข คิม
