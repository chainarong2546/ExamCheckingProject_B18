"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import jsQR from "jsqr-es6";

type Props = object;

export default function CreateTemplatePage({}: Props) {
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [totalNo, setTotalNo] = useState<number>(0);
    const [qrData, setQrData] = useState<string | null>(null);
    const [square_qr, setSquare_qr] = useState<Square | null>(null);
    const [squareStdID, setSquareStdID] = useState<Square[]>([]);
    const [squareMarker, setSquareMarker] = useState<Square[]>([]);
    const [CenterMarker, setCenterMarker] = useState<Point[]>([]);
    const [squareAnswers, setSquareAnswers] = useState<Square[][]>([]);

    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const [drawActions, setDrawActions] = useState<"qr" | "std" | "ans" | "mar" | null>(null);
    const [drawRow, setDrawRow] = useState<number>(1);
    const [drawCol, setDrawCol] = useState<number>(1);
    const [drawRowGap, setDrawRowGap] = useState<number>(0);
    const [drawColGap, setDrawColGap] = useState<number>(0);

    const [squareTemp, setSquareTemp] = useState<Square[]>([]);
    const [squareTemp2, setSquareTemp2] = useState<Square[][]>([]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "โปรดอัปโหลดไฟล์ PDF",
                });

                setImageBlob(null);
                setPdfBlob(null);
                setImageSrc(null);
                event.target.value = "";
                return;
            } else {
                const fileReader = new FileReader();
                fileReader.onload = async () => {
                    const result = fileReader.result;
                    if (result instanceof ArrayBuffer) {
                        try {
                            const fileBlob = new Blob([file], { type: "application/pdf" });
                            const formData = new FormData();
                            formData.append("file", fileBlob);

                            const fetchRes = await fetch(
                                `${process.env.NEXT_PUBLIC_IMAGE_PROCESS_API_URL}/tool/convertImageForCreateTemplate`,
                                {
                                    method: "POST",
                                    body: formData,
                                },
                            );
                            if (fetchRes.ok) {
                                const blob = await fetchRes.blob();
                                const imgSrc = URL.createObjectURL(blob);
                                setPdfBlob(fileBlob);
                                setImageBlob(blob);
                                setImageSrc(imgSrc);
                            } else {
                                event.target.value = "";
                                setImageBlob(null);
                                setPdfBlob(null);
                                setImageSrc(null);
                                return Swal.fire({
                                    icon: "error",
                                    title: "การอัปโหลดไฟล์ล้มเหลว",
                                });
                            }
                        } catch (error) {
                            console.error(error);
                            event.target.value = "";
                            setImageBlob(null);
                            setPdfBlob(null);
                            setImageSrc(null);
                            return Swal.fire({
                                icon: "error",
                                title: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
                            });
                        }
                    } else {
                        console.error("ไม่สามารถอ่านไฟล์ PDF ได้");
                    }
                };
                fileReader.readAsArrayBuffer(file);
            }
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawActions) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setStartPos({ x, y });
        setIsDrawing(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !startPos) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ctx = canvas.getContext("2d");
        if (ctx && imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw the rectangle as the user drags
                const width = x - startPos.x;
                const height = y - startPos.y;
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 1;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                if (drawActions === "qr") {
                    ctx.strokeRect(startPos.x, startPos.y, width, height);
                    return;
                }

                if (drawActions === "std") {
                    ctx.strokeStyle = "green";
                    squareStdID.forEach((square) => {
                        ctx.strokeRect(
                            square.sx,
                            square.sy,
                            square.ex - square.sx,
                            square.ey - square.sy,
                        );
                    });
                    ctx.strokeStyle = "blue";
                    ctx.strokeRect(startPos.x, startPos.y, width, height);
                    return;
                }

                if (drawActions === "ans") {
                    ctx.strokeStyle = "green";
                    squareAnswers.forEach((square) => {
                        square.forEach((s) => {
                            ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                        });
                    });
                    ctx.strokeStyle = "blue";
                    ctx.strokeRect(startPos.x, startPos.y, width, height);
                    return;
                }

                if (drawActions === "mar") {
                    ctx.strokeStyle = "green";
                    squareMarker.forEach((square) => {
                        ctx.strokeRect(
                            square.sx,
                            square.sy,
                            square.ex - square.sx,
                            square.ey - square.sy,
                        );
                    });
                    ctx.strokeStyle = "blue";
                    ctx.strokeRect(startPos.x, startPos.y, width, height);
                    return;
                }
            };
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!startPos) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ctx = canvas.getContext("2d");
        if (!ctx || !imageSrc) return;

        if (drawActions === "qr") {
            setSquareTemp([
                {
                    sx: Math.round(startPos.x),
                    sy: Math.round(startPos.y),
                    ex: Math.round(x),
                    ey: Math.round(y),
                },
            ]);
            return;
        }

        if (drawActions === "std") {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "green";
                ctx.lineWidth = 1;
                squareStdID.forEach((s) => {
                    ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                });
                ctx.strokeStyle = "blue";

                const square: Square[] = [];

                const w = (x - startPos.x - drawColGap * (drawCol - 1)) / drawCol;
                const h = (y - startPos.y - drawRowGap * (drawRow - 1)) / drawRow;

                for (let i = 0; i < drawRow; i++) {
                    for (let j = 0; j < drawCol; j++) {
                        const sx = startPos.x + w * j + drawColGap * j;
                        const sy = startPos.y + h * i + drawRowGap * i;
                        const ex = sx + w;
                        const ey = sy + h;
                        square.push({
                            sx: Math.round(sx),
                            sy: Math.round(sy),
                            ex: Math.round(ex),
                            ey: Math.round(ey),
                        });
                        ctx.strokeRect(sx, sy, w, h);
                    }
                }
                setSquareTemp(square);
            };
            return;
        }

        if (drawActions === "ans") {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "green";
                ctx.lineWidth = 1;
                squareAnswers.forEach((square) => {
                    square.forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                });
                ctx.strokeStyle = "blue";

                const square: Square[][] = [];
                const w = (x - startPos.x - drawColGap * (drawCol - 1)) / drawCol;
                const h = (y - startPos.y - drawRowGap * (drawRow - 1)) / drawRow;

                for (let i = 0; i < drawRow; i++) {
                    const s: Square[] = [];
                    for (let j = 0; j < drawCol; j++) {
                        const sx = startPos.x + w * j + drawColGap * j;
                        const sy = startPos.y + h * i + drawRowGap * i;
                        const ex = sx + w;
                        const ey = sy + h;
                        s.push({
                            sx: Math.round(sx),
                            sy: Math.round(sy),
                            ex: Math.round(ex),
                            ey: Math.round(ey),
                        });
                        ctx.strokeRect(sx, sy, w, h);
                    }
                    square.push(s);
                }
                setSquareTemp2(square);
            };
            return;
        }

        if (drawActions === "mar") {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "green";
                ctx.lineWidth = 1;
                squareMarker.forEach((s) => {
                    ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                });
                ctx.strokeStyle = "blue";

                const square: Square[] = [];

                const w = (x - startPos.x - drawColGap * (drawCol - 1)) / drawCol;
                const h = (y - startPos.y - drawRowGap * (drawRow - 1)) / drawRow;

                for (let i = 0; i < drawRow; i++) {
                    for (let j = 0; j < drawCol; j++) {
                        const sx = startPos.x + w * j + drawColGap * j;
                        const sy = startPos.y + h * i + drawRowGap * i;
                        const ex = sx + w;
                        const ey = sy + h;
                        square.push({
                            sx: Math.round(sx),
                            sy: Math.round(sy),
                            ex: Math.round(ex),
                            ey: Math.round(ey),
                        });
                        ctx.strokeRect(sx, sy, w, h);
                    }
                }
                setSquareTemp(square);
            };
            return;
        }
    };

    const handleConfirmSelect = () => {
        setDrawActions(null);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx || !imageSrc) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 1;

            if (drawActions === "qr" && squareTemp.length !== 0) {
                const imageData = ctx.getImageData(
                    squareTemp[0].sx,
                    squareTemp[0].sy,
                    squareTemp[0].ex - squareTemp[0].sx,
                    squareTemp[0].ey - squareTemp[0].sy,
                );
                const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
                if (qrCode) {
                    ctx.strokeStyle = "green";
                    ctx.strokeRect(
                        squareTemp[0].sx,
                        squareTemp[0].sy,
                        squareTemp[0].ex - squareTemp[0].sx,
                        squareTemp[0].ey - squareTemp[0].sy,
                    );
                    setQrData(qrCode.data);
                    setSquare_qr(squareTemp[0]);
                } else {
                    ctx.strokeStyle = "red";
                    ctx.strokeRect(
                        squareTemp[0].sx,
                        squareTemp[0].sy,
                        squareTemp[0].ex - squareTemp[0].sx,
                        squareTemp[0].ey - squareTemp[0].sy,
                    );
                    alert("ไม่พบรหัส QR Code");
                }
            }

            if (drawActions === "std" && squareTemp.length !== 0) {
                ctx.strokeStyle = "green";
                squareStdID.forEach((s) => {
                    ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                });
                if (squareStdID.length + squareTemp.length > 13) {
                    ctx.strokeStyle = "red";
                    squareTemp.forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                    alert("รหัสนักศึกษาไม่ควรยาวเกิน 13 ช่อง");
                } else {
                    ctx.strokeStyle = "green";
                    squareTemp.forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                    setSquareStdID([...squareStdID, ...squareTemp]);
                }
            }

            if (drawActions === "ans" && squareTemp2.length !== 0) {
                ctx.strokeStyle = "green";
                squareAnswers.forEach((square) => {
                    square.forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                });
                const total = squareAnswers.length + squareTemp2.length;
                if (total > 100) {
                    ctx.strokeStyle = "red";
                    squareTemp2.forEach((square) => {
                        square.forEach((s) => {
                            ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                        });
                    });
                    alert("คำตอบไม่ควรมีเกิน 100 ข้อ");
                } else {
                    ctx.strokeStyle = "greeb";
                    squareTemp2.forEach((square) => {
                        square.forEach((s) => {
                            ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                        });
                    });
                    setSquareAnswers([...squareAnswers, ...squareTemp2]);
                    setTotalNo(total);
                }
            }

            if (drawActions === "mar" && squareTemp.length !== 0) {
                ctx.strokeStyle = "green";
                squareMarker.forEach((s) => {
                    ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                });
                if (squareMarker.length + squareTemp.length > 4) {
                    ctx.strokeStyle = "red";
                    squareTemp.forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                    alert("เครื่องหมายมุมกระดาษไม่ควรเกิน 4 อัน");
                } else {
                    ctx.strokeStyle = "green";
                    squareTemp.forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                    setSquareMarker([...squareMarker, ...squareTemp]);
                }
            }

            setSquareTemp([]);
            setSquareTemp2([]);
        };
    };

    const handleReset = (type: "qr" | "std" | "ans" | "mar") => {
        if (type === "qr") {
            setQrData(null);
            setSquare_qr(null);
            return;
        }
        if (type === "std") {
            setSquareStdID([]);
            return;
        }
        if (type === "ans") {
            setSquareAnswers([]);
            return;
        }
        if (type === "mar") {
            setSquareMarker([]);
            return;
        }
    };

    const handleCreate = async () => {
        if (name.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "โปรดป้อน ชื่อแม่แบบกระดาษคำตอบ",
            });
            return;
        }
        if (totalNo <= 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "จำนวนข้อทั้งหมดต้องมากกว่า 0",
            });
            return;
        }
        if (!qrData || !square_qr) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "QR Code ว่างเปล่าหรือไม่ได้ตั้งค่า",
            });
            return;
        }
        if (squareStdID.length !== 13) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "รหัสนักศึกษาควรมี 13 ช่อง",
            });
            return;
        }
        if (squareAnswers.length <= 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "ช่องคำตอบต้องมากกว่า 0",
            });
            return;
        }
        if (squareMarker.length !== 4) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "เครื่องหมายมุมกระดาษควรมี 4 อัน",
            });
            return;
        }
        if (!pdfBlob || !imageBlob) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาดกับการจัดการไฟล์",
            });
            return;
        }

        let checkMarkerPass = false;
        const formData1 = new FormData();
        formData1.append("file", imageBlob);
        formData1.append("marker_tl", JSON.stringify(squareMarker[0]));
        formData1.append("marker_tr", JSON.stringify(squareMarker[1]));
        formData1.append("marker_bl", JSON.stringify(squareMarker[2]));
        formData1.append("marker_br", JSON.stringify(squareMarker[3]));
        try {
            const fetchRes = await fetch(
                `${process.env.NEXT_PUBLIC_IMAGE_PROCESS_API_URL}/tool/checkMarkerForCreateTemplate`,
                {
                    method: "POST",
                    body: formData1,
                },
            );
            const data = await fetchRes.json();
            if (data.success) {
                if (
                    data.data.marker_tl.supported &&
                    data.data.marker_tr.supported &&
                    data.data.marker_bl.supported &&
                    data.data.marker_br.supported
                ) {
                    checkMarkerPass = true;
                    setCenterMarker([
                        { x: data.data.marker_tl.center.x, y: data.data.marker_tl.center.y },
                        { x: data.data.marker_tr.center.x, y: data.data.marker_tr.center.y },
                        { x: data.data.marker_bl.center.x, y: data.data.marker_bl.center.y },
                        { x: data.data.marker_br.center.x, y: data.data.marker_br.center.y },
                    ]);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "ตรวจสอบเครื่องหมายมุมกระดาษไม่ผ่าน",
                    });
                    return;
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ตรวจสอบเครื่องหมายมุมกระดาษไม่ผ่าน",
                });
                return;
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "ตรวจสอบเครื่องหมายมุมกระดาษไม่ผ่าน",
            });
            return;
        }

        if (!checkMarkerPass) return;

        const imgFormData = new FormData();
        imgFormData.append("image", imageBlob);

        const pdfFormData = new FormData();
        pdfFormData.append("image", pdfBlob);

        try {
            // สร้าง Promise สำหรับ fetch API สองเส้นพร้อมกัน
            const [response1, response2] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/`, {
                    method: "POST",
                    body: imgFormData,
                }),
                fetch(`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/`, {
                    method: "POST",
                    body: pdfFormData,
                }),
            ]);

            if (response1.ok && response2.ok) {
                const data1 = await response1.json();
                const data2 = await response2.json();

                if (data1.success && data1.data && data2.success && data2.data) {
                    // ถ้าผ่านการตรวจสอบ ก็ทำการบันทึกได้
                    const templateData = {
                        name: name,
                        total_no: totalNo,
                        marker_qr: square_qr,
                        marker_qr_data: qrData,
                        marker_tl: squareMarker[0],
                        marker_tr: squareMarker[1],
                        marker_bl: squareMarker[2],
                        marker_br: squareMarker[3],
                        marker_tl_center: CenterMarker[0],
                        marker_tr_center: CenterMarker[1],
                        marker_bl_center: CenterMarker[2],
                        marker_br_center: CenterMarker[3],
                        square_std_id: squareStdID,
                        square_answer: squareAnswers,
                        image_url: data1.data.filename,
                        pdf_url: data2.data.filename,
                    };

                    const fetchRes = await fetch("/api/templates", {
                        method: "POST",
                        body: JSON.stringify(templateData),
                    });
                    const data = await fetchRes.json();
                    if (data.success) {
                        Swal.fire({
                            icon: "success",
                            title: data.message,
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {
                            router.push("/dashboard/templates");
                        });
                        return;
                    }
                    Swal.fire({
                        icon: "error",
                        title: data.message,
                    });
                    return;
                }
            }

            Swal.fire({
                icon: "error",
                title: "การอัปโหลดไฟล์ล้มเหลว",
                text: "เกิดข้อผิดพลาดระหว่างการแปลงรูปภาพ",
            });
            return;
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "การอัปโหลดไฟล์ล้มเหลว",
                text: "ข้อผิดพลาดในการอัปโหลดไฟล์",
            });
            return;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (ctx && imageSrc) {
            // Clear canvas and redraw the image
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        }
    }, [imageSrc]);

    return (
        <div className="p-2 my-2">
            <div className="m-4">
                <p>ชื่อแม่แบบกระดาษคำตอบ</p>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 "
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
            </div>
            <div className="m-4">
                <p>จำนวนข้อทั้งหมด</p>
                <input
                    type="number"
                    value={totalNo}
                    className="pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 "
                    disabled={true}
                />
            </div>
            <hr />

            <div className="flex flex-col items-center m-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        handleImageUpload(e);
                    }}
                    className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />

                {/* Container for Canvas */}
                {imageSrc && (
                    <div className="flex gap-4">
                        <div>
                            <canvas
                                ref={canvasRef}
                                width={848}
                                height={1200}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                            />
                        </div>
                        <div className="flex flex-col w-[400px] max-h-[1200px]">
                            <div className="p-3 border rounded-md rounded-b-none">
                                <p>เลือกสิ่งที่ต้องการวาด</p>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <input
                                            type="radio"
                                            name="action"
                                            className="m-2"
                                            checked={drawActions === "qr"}
                                            onChange={() => {
                                                setDrawActions("qr");
                                            }}
                                        />
                                        <span>QR Code</span>
                                    </div>
                                    <button
                                        className="px-3 py-1 rounded-md bg-red-600 hover:brightness-90 m-1"
                                        onClick={() => {
                                            handleReset("qr");
                                        }}
                                    >
                                        รีเซ็ต
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <input
                                            type="radio"
                                            name="action"
                                            className="m-2"
                                            checked={drawActions === "mar"}
                                            onChange={() => {
                                                setDrawActions("mar");
                                            }}
                                        />
                                        <span>เครื่องหมายมุมกระดาษ</span>
                                    </div>
                                    <button
                                        className="px-3 py-1 rounded-md bg-red-600 hover:brightness-90 m-1"
                                        onClick={() => {
                                            handleReset("mar");
                                        }}
                                    >
                                        รีเซ็ต
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <input
                                            type="radio"
                                            name="action"
                                            className="m-2"
                                            checked={drawActions === "std"}
                                            onChange={() => {
                                                setDrawActions("std");
                                            }}
                                        />
                                        <span>รหัสนักศึกษา</span>
                                    </div>
                                    <button
                                        className="px-3 py-1 rounded-md bg-red-600 hover:brightness-90 m-1"
                                        onClick={() => {
                                            handleReset("std");
                                        }}
                                    >
                                        รีเซ็ต
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <input
                                            type="radio"
                                            name="action"
                                            className="m-2"
                                            checked={drawActions === "ans"}
                                            onChange={() => {
                                                setDrawActions("ans");
                                            }}
                                        />
                                        <span>ช่องคำตอบ</span>
                                    </div>
                                    <button
                                        className="px-3 py-1 rounded-md bg-red-600 hover:brightness-90 m-1"
                                        onClick={() => {
                                            handleReset("ans");
                                        }}
                                    >
                                        รีเซ็ต
                                    </button>
                                </div>
                                <button
                                    className="px-9 py-1 rounded-md bg-green-600 hover:brightness-90 m-2"
                                    onClick={() => {
                                        handleConfirmSelect();
                                    }}
                                >
                                    ตกลง
                                </button>

                                <hr className="m-4" />

                                <p>เครื่องมือช่วยวาด</p>
                                <div className="grid grid-cols-5 items-center m-2">
                                    <span className="col-span-3">จำนวนแถว</span>
                                    <input
                                        type="number"
                                        value={drawRow}
                                        className="m-1 text-neutral-950 border rounded-md col-span-1 p-1"
                                        onChange={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 1;
                                            setDrawRow(value);
                                        }}
                                        onBlur={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 1;
                                            setDrawRow(value < 1 ? 1 : value);
                                        }}
                                    />
                                    <span className="col-span-1">แถว</span>
                                    <span className="col-span-3">จำนวนคอลัม</span>
                                    <input
                                        type="number"
                                        value={drawCol}
                                        className="m-1 text-neutral-950 border rounded-md col-span-1 p-1"
                                        onChange={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 1;
                                            setDrawCol(value);
                                        }}
                                        onBlur={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 1;
                                            setDrawCol(value < 1 ? 1 : value);
                                        }}
                                    />
                                    <span className="col-span-1">คอลัม</span>
                                    <span className="col-span-3">ช่องว่างระหว่างแถว</span>
                                    <input
                                        type="number"
                                        value={drawRowGap}
                                        className="m-1 text-neutral-950 border rounded-md col-span-1 p-1"
                                        onChange={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 0;
                                            setDrawRowGap(value);
                                        }}
                                        onBlur={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 0;
                                            setDrawRowGap(value < 0 ? 0 : value);
                                        }}
                                    />
                                    <span className="col-span-1">พิกเซล</span>
                                    <span className="col-span-3">ช่องว่างระหว่างคอลัม</span>
                                    <input
                                        type="number"
                                        value={drawColGap}
                                        className="m-1 text-neutral-950 border rounded-md col-span-1 p-1"
                                        onChange={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 0;
                                            setDrawColGap(value);
                                        }}
                                        onBlur={(event) => {
                                            const value = event.target.value
                                                ? parseInt(event.target.value, 10)
                                                : 0;
                                            setDrawColGap(value < 0 ? 0 : value);
                                        }}
                                    />
                                    <span className="col-span-1">พิกเซล</span>
                                </div>
                            </div>
                            <div className="p-3 border rounded-md rounded-t-none overflow-auto">
                                <p>ผลลัพธ์การวาด QR Code</p>
                                <div className="p-2">
                                    <p className="">QR Code : {JSON.stringify(square_qr)}</p>
                                    <p className="">ข้อมูลที่อ่านได้ : {qrData}</p>
                                </div>
                                <hr className="m-4" />

                                <p>ผลลัพธ์การวาด เครื่องหมายมุมกระดาษ</p>
                                <div className="p-2">
                                    <p className="">เครื่องหมายที่ 1 : {JSON.stringify(squareMarker[0])}</p>
                                    <p className="">เครื่องหมายที่ 2 : {JSON.stringify(squareMarker[1])}</p>
                                    <p className="">เครื่องหมายที่ 3 : {JSON.stringify(squareMarker[2])}</p>
                                    <p className="">เครื่องหมายที่ 4 : {JSON.stringify(squareMarker[3])}</p>
                                </div>
                                <hr className="m-4" />

                                <p>ผลลัพธ์การวาด ช่องรหัสนักศึกษา</p>
                                <div className="p-2">
                                    {squareStdID.map((std, index) => (
                                        <p key={index} className="">
                                            ช่องที่ {index + 1} : {JSON.stringify(std)}
                                        </p>
                                    ))}
                                </div>
                                <hr className="m-4" />

                                <p>ผลลัพธ์การวาด ช่องคำตอบ</p>
                                <div className="p-2">
                                    {squareAnswers.map((std, index) => (
                                        <p key={index} className="">
                                            ข้อที่ {index + 1} : {JSON.stringify(std)}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                className="py-2 px-6 rounded-lg m-auto block bg-green-600 hover:brightness-90"
                onClick={() => {
                    handleCreate();
                }}
            >
                สร้าง
            </button>
        </div>
    );
}
