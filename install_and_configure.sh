#!/bin/bash

# ออกจากสคริปต์ทันทีหากมีข้อผิดพลาด
set -e

# ตรวจสอบว่าสคริปต์ถูกเรียกใช้ด้วยสิทธิ์ root หรือไม่
if [ "$EUID" -ne 0 ]; then
  echo "กรุณาเรียกใช้สคริปต์ด้วยสิทธิ์ root"
  exit
fi

# -------------------------------
# อัปเดตแพ็กเกจและติดตั้งแพ็กเกจที่จำเป็น
# -------------------------------
apt update
apt install -y curl gnupg lsb-release ufw openssl software-properties-common

# -------------------------------
# เพิ่ม deadsnakes PPA และติดตั้ง Python 3.11
# -------------------------------
add-apt-repository -y ppa:deadsnakes/ppa
apt update
apt install -y python3.11 python3.11-venv

# ติดตั้ง pip สำหรับ Python 3.11
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

# -------------------------------
# ติดตั้ง Node.js 20 LTS
# -------------------------------
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# -------------------------------
# ติดตั้ง PostgreSQL 16
# -------------------------------
# เพิ่ม PostgreSQL Apt Repository
curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg
echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
apt update
apt install -y postgresql-16

# สร้างรหัสผ่านสำหรับผู้ใช้ postgres
POSTGRES_PASSWORD=$(openssl rand -hex 64)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"

# อนุญาตการเชื่อมต่อจากภายนอก
echo "กำลังตั้งค่า PostgreSQL ให้อนุญาตการเชื่อมต่อจากภายนอก..."
echo "listen_addresses = '*'" >> /etc/postgresql/16/main/postgresql.conf
echo "host    all             all             0.0.0.0/0               md5" >> /etc/postgresql/16/main/pg_hba.conf
systemctl restart postgresql

# -------------------------------
# ติดตั้ง Nginx
# -------------------------------
apt install -y nginx

# -------------------------------
# ติดตั้ง Certbot
# -------------------------------
apt install -y certbot python3-certbot-nginx

# -------------------------------
# ติดตั้ง Redis
# -------------------------------
apt install -y redis-server

# สร้างรหัสผ่านสำหรับ Redis
REDIS_PASSWORD=$(openssl rand -hex 64)
# ตั้งค่ารหัสผ่านในไฟล์ redis.conf

echo "requirepass $REDIS_PASSWORD" >> /etc/redis/redis.conf
systemctl restart redis.service

# -------------------------------
# ตั้งค่า UFW (Firewall)
# -------------------------------
echo "กำลังตั้งค่า UFW..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 5432/tcp  # PostgreSQL
ufw allow 6379/tcp  # Redis
ufw --force enable

# -------------------------------
# ขอใบรับรอง SSL ด้วย Certbot
# -------------------------------
echo "กรุณากรอกโดเมนทั้งหมดที่คุณต้องการ (คั่นด้วยช่องว่าง):"
read DOMAINS
echo "กรุณากรอกอีเมลสำหรับการสมัครใช้ Certbot:"
read EMAIL

# สร้างอาร์กิวเมนต์ -d สำหรับแต่ละโดเมน
DOMAIN_ARGS=""
for DOMAIN in $DOMAINS; do
    DOMAIN_ARGS="$DOMAIN_ARGS -d $DOMAIN"
done

# ขอใบรับรอง SSL
certbot --nginx --agree-tos --no-eff-email --email $EMAIL $DOMAIN_ARGS

# -------------------------------
# แสดงผลรหัสผ่านที่สร้างขึ้น
# -------------------------------
echo "--------------------------------------"
echo "การติดตั้งและตั้งค่าเสร็จสมบูรณ์"
echo "--------------------------------------"
echo "รหัสผ่านสำหรับผู้ใช้ 'postgres' คือ:"
echo "$POSTGRES_PASSWORD"
echo "--------------------------------------"
echo "รหัสผ่านสำหรับ Redis คือ:"
echo "$REDIS_PASSWORD"
echo "--------------------------------------"
