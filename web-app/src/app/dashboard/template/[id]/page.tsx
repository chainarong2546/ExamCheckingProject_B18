"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JsonValue } from "@prisma/client/runtime/library";
import ShowError from "@/components/ShowError";
import { faEllipsisVertical, faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

type TemplateDetail = {
    id: number;
    name: string;
    total_no: number;
    image_url: string;
    pdf_url: string;
    marker_qr: JsonValue;
    marker_qr_data: string;
    marker_tl: JsonValue;
    marker_tr: JsonValue;
    marker_bl: JsonValue;
    marker_br: JsonValue;
    marker_tl_center: JsonValue;
    marker_tr_center: JsonValue;
    marker_bl_center: JsonValue;
    marker_br_center: JsonValue;
    square_std_id: JsonValue;
    square_answer: JsonValue;
    un_use: boolean;
    created_at: Date;
    updated_at: Date;
} | null;

type Props = {
    params: {
        id: string;
    };
};

export default function TemplateDetail({ params }: Props) {
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [template, setTemplate] = useState<TemplateDetail>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [showDraw, setShowDraw] = useState<boolean>(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handlerDelete = async () => {
        Swal.fire({
            title: "ต้องการลบแม่แบบกระดาษคำตอบนี้หรือไม่",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "ลบ",
            denyButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const fetchRes = await fetch(`/api/templates/${params.id}`, {
                    method: "DELETE",
                });

                const data = await fetchRes.json();
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        router.push("/dashboard/templates");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: data.message,
                    });
                }
            } else if (result.isDenied) {
                Swal.fire({
                    icon: "info",
                    title: "การเปลี่ยนแปลงไม่ถูกบันทึก",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    useEffect(() => {
        setLoading(true);
        try {
            const fetchTemplateData = async () => {
                const fetchRes = await fetch(`/api/templates/${params.id}`);
                const data = await fetchRes.json();
                if (data.success) {
                    setErrorMsg(null);
                    setTemplate(data.data);
                } else {
                    setErrorMsg(data.message);
                }
            };
            fetchTemplateData();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, [params.id]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (ctx && template?.image_url) {
            const img = new Image();
            img.src = `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${template.image_url}`;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "green";
                ctx.lineWidth = 1;
                if (showDraw) {
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 1;
                    (template.square_answer as Square[][]).forEach((ans_no) => {
                        ans_no.forEach((s) => {
                            ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                        });
                    });
                    (template.square_std_id as Square[]).forEach((s) => {
                        ctx.strokeRect(s.sx, s.sy, s.ex - s.sx, s.ey - s.sy);
                    });
                    ctx.strokeRect(
                        (template.marker_qr as Square).sx,
                        (template.marker_qr as Square).sy,
                        (template.marker_qr as Square).ex - (template.marker_qr as Square).sx,
                        (template.marker_qr as Square).ey - (template.marker_qr as Square).sy,
                    );

                    ctx.strokeRect(
                        (template.marker_tl as Square).sx,
                        (template.marker_tl as Square).sy,
                        (template.marker_tl as Square).ex - (template.marker_tl as Square).sx,
                        (template.marker_tl as Square).ey - (template.marker_tl as Square).sy,
                    );
                    ctx.strokeRect(
                        (template.marker_tr as Square).sx,
                        (template.marker_tr as Square).sy,
                        (template.marker_tr as Square).ex - (template.marker_tr as Square).sx,
                        (template.marker_tr as Square).ey - (template.marker_tr as Square).sy,
                    );
                    ctx.strokeRect(
                        (template.marker_bl as Square).sx,
                        (template.marker_bl as Square).sy,
                        (template.marker_bl as Square).ex - (template.marker_bl as Square).sx,
                        (template.marker_bl as Square).ey - (template.marker_bl as Square).sy,
                    );
                    ctx.strokeRect(
                        (template.marker_br as Square).sx,
                        (template.marker_br as Square).sy,
                        (template.marker_br as Square).ex - (template.marker_br as Square).sx,
                        (template.marker_br as Square).ey - (template.marker_br as Square).sy,
                    );

                    ctx.beginPath();
                    ctx.arc(
                        (template.marker_tl_center as Point).x,
                        (template.marker_tl_center as Point).y,
                        3,
                        0,
                        2 * Math.PI,
                    );
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(
                        (template.marker_tr_center as Point).x,
                        (template.marker_tr_center as Point).y,
                        3,
                        0,
                        2 * Math.PI,
                    );
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(
                        (template.marker_bl_center as Point).x,
                        (template.marker_bl_center as Point).y,
                        3,
                        0,
                        2 * Math.PI,
                    );
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(
                        (template.marker_br_center as Point).x,
                        (template.marker_br_center as Point).y,
                        3,
                        0,
                        2 * Math.PI,
                    );
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.stroke();
                }
            };
        }
    }, [showDraw, template]);

    return (
        <>
            {loading ? (
                <p>กำลังโหลด...</p>
            ) : errorMsg !== null ? (
                <ShowError msg={errorMsg} />
            ) : (
                <div className="p-2 my-2">
                    <div className="flex justify-between">
                        <div>
                            <p>สร้างเมื่อ : {template?.created_at.toLocaleString()}</p>
                            <p>อัพเดทเมื่อ : {template?.updated_at.toLocaleString()}</p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="p-2 text-xl text-neutral-50 focus:outline-none"
                            >
                                <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    className="text-neutral-950 dark:text-neutral-50"
                                />
                            </button>
                            {dropdownOpen && (
                                <ul className="absolute right-0 w-40 shadow-lg z-20 text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900">
                                    <li
                                        onClick={() => handlerDelete()}
                                        className="cursor-pointer flex gap-4 px-4 py-2 bg-inherit dark:bg-inherit hover:brightness-90"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        <span>ลบ</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>

                    <hr className="my-5" />
                    <div className="m-4">
                        <p>ชื่อแม่แบบกระดาษคำตอบ</p>
                        <input
                            type="text"
                            placeholder="Name"
                            value={template?.name || ""}
                            className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100"
                            onChange={() => {}}
                            disabled
                        />
                    </div>
                    <div className="m-4">
                        <p>จำนวนข้อทั้งหมด</p>
                        <input
                            type="number"
                            value={template?.total_no || ""}
                            className="pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100"
                            onChange={() => {}}
                            disabled
                        />
                    </div>
                    <hr />

                    <div className="flex gap-4 m-2">
                        <button
                            className="px-4 py-2 rounded-lg text-white bg-blue-700 hover:brightness-90"
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${template?.image_url}`;
                                link.download = `${template?.name}_${template?.image_url}`;
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                link.target = "_blank";
                                document.body.removeChild(link);
                            }}
                        >
                            ดาวน์โหลดรูป
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg text-white bg-red-700 hover:brightness-90"
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${template?.pdf_url}`;
                                link.download = `${template?.name}_${template?.pdf_url}`;
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                link.target = "_blank";
                                document.body.removeChild(link);
                            }}
                        >
                            ดาวน์โหลด PDF
                        </button>
                    </div>
                    <div className="flex flex-col items-center m-4">
                        {template?.image_url && (
                            <div className="flex gap-4">
                                <div>
                                    <canvas
                                        ref={canvasRef}
                                        width={848}
                                        height={1200}
                                        className=""
                                    />
                                </div>
                                <div className="flex flex-col w-[400px] max-h-[1200px]">
                                    <div className="p-3 border rounded-md overflow-auto">
                                        <button
                                            onClick={() => {
                                                setShowDraw(!showDraw);
                                            }}
                                            className="px-3 py-2 m-2 bg-yellow-500 rounded-md"
                                        >
                                            {showDraw ? (
                                                <>
                                                    <FontAwesomeIcon icon={faEye} /> ซ่อนเส้น
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faEyeSlash} /> แสดงเส้น
                                                </>
                                            )}
                                        </button>
                                        <p>ผลลัพธ์ของ QR Code</p>
                                        <div className="p-2">
                                            <p className="">
                                                พิกัด QR : {JSON.stringify(template.marker_qr)}
                                            </p>
                                            <p className="">
                                                ข้อมูลจาก QR Code : {template.marker_qr_data}
                                            </p>
                                        </div>
                                        <hr className="m-4" />

                                        <p> Marker</p>
                                        <div className="p-2">
                                            <p className="">
                                                พิกัด Mark 1 : {JSON.stringify(template.marker_tl)}
                                            </p>
                                            <p className="">
                                                พิกัด Mark 2 : {JSON.stringify(template.marker_tr)}
                                            </p>
                                            <p className="">
                                                พิกัด Mark 3 : {JSON.stringify(template.marker_bl)}
                                            </p>
                                            <p className="">
                                                พิกัด Mark 4 : {JSON.stringify(template.marker_br)}
                                            </p>
                                        </div>
                                        <hr className="m-4" />

                                        <p>ผลลัพธ์ของรหัสนักศึกษา</p>
                                        <div className="p-2">
                                            {template.square_std_id &&
                                                (template.square_std_id as Array<Square>).map(
                                                    (std: Square, index: number) => (
                                                        <p key={index} className="">
                                                            ตำแหน่งที่ {index + 1} :{" "}
                                                            {JSON.stringify(std)}
                                                        </p>
                                                    ),
                                                )}
                                        </div>
                                        <hr className="m-4" />

                                        <p>ผลลัพธ์ของช่องกากบาท</p>
                                        <div className="p-2">
                                            {template.square_answer &&
                                                (template.square_answer as Array<Square>).map(
                                                    (std: Square, index: number) => (
                                                        <p key={index} className="">
                                                            ข้อที่ {index + 1} :{" "}
                                                            {JSON.stringify(std)}
                                                        </p>
                                                    ),
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
