export const idParamParse = (id: string): number | null => {
    const num = Number(id);

    // ตรวจสอบว่า string เป็นตัวเลขและเป็นจำนวนเต็ม
    if (!isNaN(num) && Number.isInteger(num)) {
        return num;
    } else {
        return null; // คืนค่า null ถ้าไม่สามารถแปลงเป็น integer ได้
    }
};
