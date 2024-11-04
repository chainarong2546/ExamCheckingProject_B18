"use client";
import React, { useCallback, useEffect, useState } from "react";
import { JsonValue } from "@prisma/client/runtime/library";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NextImage from "next/image";
import * as XLSX from "xlsx";

type SheetShowDetail = {
    id: number;
    name: string;
    group_id: number;
    deleted: boolean;
    template_id: number | null;
    answer_id: number | null;
    predict_ans_detail: JsonValue | null;
    predict_ans_result: JsonValue | null;
    predict_std_detail: JsonValue | null;
    predict_std_result: JsonValue | null;
    total_score: number;
    status: string;
    process_id: string | null;
    create_at: Date;
    updated_at: Date;
};

type GroupShowDetail = {
    id: number;
    name: string;
    subject: string;
    year: number;
    term: number;
    created_at: Date;
    updated_at: Date;
    sheets: {
        id: number;
        name: string;
        status: string;
    }[];
    _count: {
        sheets: number;
    };
    answers: {
        id: number;
        name: string;
    };
    templates: {
        id: number;
        name: string;
    };
} | null;

type AnswerShowDetail = {
    id: number;
    name: string;
    owner_id: number;
    subject: string;
    year: number;
    term: number;
    total_no: number;
    answer: JsonValue;
    archive: boolean;
    created_at: Date;
    updated_at: Date;
} | null;

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

const MySwal = withReactContent(Swal);

export default function PredictDetail_Page({ params }: Props) {
    const [group, setGroup] = useState<GroupShowDetail>(null);
    const [answer, setAnswer] = useState<AnswerShowDetail>(null);
    const [template, setTemplate] = useState<TemplateDetail>(null);
    const [loop, setLoop] = useState(false);

    const fetchGroupData = useCallback(async () => {
        try {
            const fetchRes = await fetch(`/api/groups/${params.id}`, {
                method: "GET",
            });
            const data = await fetchRes.json();
            if (data.success && data.data) {
                setGroup(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, [params.id]);

    const hendlerDelete = (id: number) => {
        Swal.fire({
            title: "คุณต้องการลบกระดาษคำตอบใช้หรือไม่",
            text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่ ลบมัน",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const fetchRes = await fetch(`/api/sheets/${id}`, {
                        method: "DELETE",
                    });
                    const data = await fetchRes.json();
                    if (data.success && data.data) {
                        Swal.fire({
                            title: "ลบแล้ว",
                            text: "ไฟล์ของคุณถูกลบแล้ว",
                            icon: "success",
                        });

                        setGroup((prev) => {
                            if (!prev) return prev;
                            const newGroup = {
                                ...prev,
                                sheets: prev.sheets.filter((sheet) => sheet.id !== id),
                                _count: {
                                    ...prev._count,
                                    sheets: prev._count.sheets - 1,
                                },
                            };
                            return newGroup;
                        });
                    } else {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด",
                            text: data.message,
                            icon: "error",
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    const handerPredict = async () => {
        if (!group || !template || !answer) {
            return;
        }
        try {
            for (const sheet of group.sheets) {
                if (sheet.status != "completed") {
                    // ดึง URL ของภาพจากฐานข้อมูล
                    const imageUrl = sheet.name; // หรือเป็นฟิลด์ที่เก็บ URL ของภาพ

                    // ดาวน์โหลดภาพจาก URL และแปลงเป็น Blob
                    const imageResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${imageUrl}`,
                    );
                    const imageBlob = await imageResponse.blob();

                    // ใช้ fetch เพื่อส่งข้อมูลไปยัง API /predict
                    const formData = new FormData();
                    formData.append("image", imageBlob);
                    formData.append("template_answer", JSON.stringify(template.square_answer));
                    formData.append("template_std_id", JSON.stringify(template.square_std_id));
                    formData.append("answer", JSON.stringify(answer.answer));
                    formData.append(
                        "template_marker",
                        JSON.stringify({
                            marker_tl: template.marker_tl,
                            marker_tr: template.marker_tr,
                            marker_bl: template.marker_bl,
                            marker_br: template.marker_br,
                        }),
                    );
                    formData.append(
                        "template_marker_center",
                        JSON.stringify({
                            marker_tl_center: template.marker_tl_center,
                            marker_tr_center: template.marker_tr_center,
                            marker_bl_center: template.marker_bl_center,
                            marker_br_center: template.marker_br_center,
                        }),
                    );

                    const fetchRes = await fetch(
                        `${process.env.NEXT_PUBLIC_IMAGE_PROCESS_API_URL}/predict/predict`,
                        {
                            method: "POST",
                            body: formData,
                        },
                    );
                    const data = await fetchRes.json();
                    if (data.success && data.data) {
                        await fetch(`/api/sheets/${sheet.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                process_id: data.data.task_id,
                                template_id: template.id,
                                answer_id: answer.id,
                                status: "sent",
                            }),
                        });
                        setLoop(true);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    function checkAnswerAllTrue(
        a: boolean,
        b: boolean,
        c: boolean,
        d: boolean,
        aPredicted: number,
        bPredicted: number,
        cPredicted: number,
        dPredicted: number,
    ): boolean {
        if (a && aPredicted !== 1) {
            return false;
        }
        if (!a && aPredicted == 1) {
            return false;
        }
        if (b && bPredicted !== 1) {
            return false;
        }
        if (!b && bPredicted == 1) {
            return false;
        }
        if (c && cPredicted !== 1) {
            return false;
        }
        if (!c && cPredicted == 1) {
            return false;
        }
        if (d && dPredicted !== 1) {
            return false;
        }
        if (!d && dPredicted == 1) {
            return false;
        }
        return true;
    }

    function checkAnswerAllFalse(
        a: boolean,
        b: boolean,
        c: boolean,
        d: boolean,
        aPredicted: number,
        bPredicted: number,
        cPredicted: number,
        dPredicted: number,
    ): boolean {
        if (a && aPredicted === 1) {
            return true;
        }
        if (b && bPredicted === 1) {
            return true;
        }
        if (c && cPredicted === 1) {
            return true;
        }
        if (d && dPredicted === 1) {
            return true;
        }
        return false;
    }

    const handleViewDetail = async (img_id: number, imageUrl: string) => {
        try {
            const fetchRes = await fetch(`/api/sheets/${img_id}`, {
                method: "GET",
            });
            const sheet = await fetchRes.json();

            if (sheet.success && sheet.data) {
                const sheetData: SheetShowDetail = sheet.data;
                MySwal.fire({
                    title: "รายละเอียดการตรวจ",
                    html: (
                        <div className="m-5">
                            <button
                                className="px-3 py-2 m-2 rounded-md bg-green-700 text-white hover:brightness-110"
                                onClick={() => {
                                    handleExport(sheetData, "excel");
                                }}
                            >
                                ส่งออกเป็น Excel
                            </button>
                            <button
                                className="px-3 py-2 m-2 rounded-md bg-blue-700 text-white hover:brightness-110"
                                onClick={() => {
                                    handleExport(sheetData, "csv");
                                }}
                            >
                                ส่งออกเป็น CSV
                            </button>
                            <div className="flex flex-col lg:flex-row gap-4 items-start">
                                <canvas
                                    ref={(canvas) => {
                                        if (canvas) {
                                            const aa = async () => {
                                                const ctx = canvas.getContext("2d");
                                                if (ctx && template) {
                                                    // ดาวน์โหลดภาพจาก URL และแปลงเป็น Blob
                                                    const imageResponse = await fetch(imageUrl);
                                                    const imageBlob = await imageResponse.blob();

                                                    // ใช้ fetch เพื่อส่งข้อมูลไปยัง API /predict
                                                    const formData = new FormData();
                                                    formData.append("image", imageBlob);
                                                    formData.append(
                                                        "template_marker",
                                                        JSON.stringify({
                                                            marker_tl: template.marker_tl,
                                                            marker_tr: template.marker_tr,
                                                            marker_bl: template.marker_bl,
                                                            marker_br: template.marker_br,
                                                        }),
                                                    );
                                                    formData.append(
                                                        "template_marker_center",
                                                        JSON.stringify({
                                                            marker_tl_center:
                                                                template.marker_tl_center,
                                                            marker_tr_center:
                                                                template.marker_tr_center,
                                                            marker_bl_center:
                                                                template.marker_bl_center,
                                                            marker_br_center:
                                                                template.marker_br_center,
                                                        }),
                                                    );

                                                    const imageTransformed = await fetch(
                                                        `${process.env.NEXT_PUBLIC_IMAGE_PROCESS_API_URL}/tool/transform`,
                                                        {
                                                            method: "POST",
                                                            body: formData,
                                                        },
                                                    );
                                                    const imageTransformedBlob =
                                                        await imageTransformed.blob();

                                                    const img = new Image();
                                                    img.src =
                                                        URL.createObjectURL(imageTransformedBlob);
                                                    img.onload = () => {
                                                        ctx.clearRect(
                                                            0,
                                                            0,
                                                            canvas.width,
                                                            canvas.height,
                                                        );
                                                        ctx.drawImage(
                                                            img,
                                                            0,
                                                            0,
                                                            canvas.width,
                                                            canvas.height,
                                                        );
                                                        ctx.strokeStyle = "green";
                                                        ctx.lineWidth = 1;
                                                        ctx.strokeStyle = "red";
                                                        ctx.lineWidth = 1;
                                                        (
                                                            template.square_answer as Square[][]
                                                        ).forEach((ans_no) => {
                                                            ans_no.forEach((s) => {
                                                                ctx.strokeRect(
                                                                    s.sx,
                                                                    s.sy,
                                                                    s.ex - s.sx,
                                                                    s.ey - s.sy,
                                                                );
                                                            });
                                                        });
                                                        (
                                                            template.square_std_id as Square[]
                                                        ).forEach((s) => {
                                                            ctx.strokeRect(
                                                                s.sx,
                                                                s.sy,
                                                                s.ex - s.sx,
                                                                s.ey - s.sy,
                                                            );
                                                        });
                                                        ctx.strokeRect(
                                                            (template.marker_qr as Square).sx,
                                                            (template.marker_qr as Square).sy,
                                                            (template.marker_qr as Square).ex -
                                                                (template.marker_qr as Square).sx,
                                                            (template.marker_qr as Square).ey -
                                                                (template.marker_qr as Square).sy,
                                                        );

                                                        ctx.strokeRect(
                                                            (template.marker_qr as Square).sx,
                                                            (template.marker_qr as Square).sy,
                                                            (template.marker_qr as Square).ex -
                                                                (template.marker_qr as Square).sx,
                                                            (template.marker_qr as Square).ey -
                                                                (template.marker_qr as Square).sy,
                                                        );

                                                        ctx.strokeRect(
                                                            (template.marker_tl as Square).sx,
                                                            (template.marker_tl as Square).sy,
                                                            (template.marker_tl as Square).ex -
                                                                (template.marker_tl as Square).sx,
                                                            (template.marker_tl as Square).ey -
                                                                (template.marker_tl as Square).sy,
                                                        );
                                                        ctx.strokeRect(
                                                            (template.marker_tr as Square).sx,
                                                            (template.marker_tr as Square).sy,
                                                            (template.marker_tr as Square).ex -
                                                                (template.marker_tr as Square).sx,
                                                            (template.marker_tr as Square).ey -
                                                                (template.marker_tr as Square).sy,
                                                        );
                                                        ctx.strokeRect(
                                                            (template.marker_bl as Square).sx,
                                                            (template.marker_bl as Square).sy,
                                                            (template.marker_bl as Square).ex -
                                                                (template.marker_bl as Square).sx,
                                                            (template.marker_bl as Square).ey -
                                                                (template.marker_bl as Square).sy,
                                                        );
                                                        ctx.strokeRect(
                                                            (template.marker_br as Square).sx,
                                                            (template.marker_br as Square).sy,
                                                            (template.marker_br as Square).ex -
                                                                (template.marker_br as Square).sx,
                                                            (template.marker_br as Square).ey -
                                                                (template.marker_br as Square).sy,
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
                                                    };
                                                }
                                            };

                                            aa();
                                        }
                                    }}
                                    width={848}
                                    height={1200}
                                />
                                <div className="flex-grow w-full">
                                    <table className="my-4">
                                        <tbody>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    รหัสนักศึกษา
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {`${(
                                                        sheetData.predict_std_result as Array<number>
                                                    )
                                                        .slice(0, 12)
                                                        .join("")}-${
                                                        (
                                                            sheetData.predict_std_result as Array<number>
                                                        )[12]
                                                    }`}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    วิชา
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {group?.subject}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    ปีการศึกษา
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {`${group?.term}/${group?.year}`}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    กลุ่มการตรวจ
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {group?.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    ชุดเฉลย
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {answer?.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    แม่แบบกระดาษคำตอบ
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {template?.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                    วันที่ตรวจ
                                                </th>
                                                <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                    {`${sheetData.updated_at}`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="my-4 w-full">
                                        <thead>
                                            <tr>
                                                <th className="border border-neutral-700 dark:border-neutral-400">
                                                    ข้อที่
                                                </th>
                                                <th className="border border-neutral-700 dark:border-neutral-400">
                                                    เฉลย
                                                </th>
                                                <th className="border border-neutral-700 dark:border-neutral-400">
                                                    ตอบ
                                                </th>
                                                <th className="border border-neutral-700 dark:border-neutral-400">
                                                    คะแนน
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(sheetData.predict_ans_result as Array<Choice>).map(
                                                (shData, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-neutral-700 dark:border-neutral-400">
                                                            {index + 1}
                                                        </td>
                                                        <td className="border border-neutral-700 dark:border-neutral-400">
                                                            {(answer?.answer as Array<Answer>)[
                                                                index
                                                            ].a
                                                                ? "a "
                                                                : ""}
                                                            {(answer?.answer as Array<Answer>)[
                                                                index
                                                            ].b
                                                                ? "b "
                                                                : ""}
                                                            {(answer?.answer as Array<Answer>)[
                                                                index
                                                            ].c
                                                                ? "c "
                                                                : ""}
                                                            {(answer?.answer as Array<Answer>)[
                                                                index
                                                            ].d
                                                                ? "d "
                                                                : ""}
                                                        </td>
                                                        <td className="border border-neutral-700 dark:border-neutral-400">
                                                            {shData.a === 1 ? "a " : ""}
                                                            {shData.b === 1 ? "b " : ""}
                                                            {shData.c === 1 ? "c " : ""}
                                                            {shData.d === 1 ? "d " : ""}
                                                        </td>
                                                        <td className="border border-neutral-700 dark:border-neutral-400">
                                                            {(answer?.answer as Array<Answer>)[
                                                                index
                                                            ].all
                                                                ? checkAnswerAllTrue(
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].a,
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].b,
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].c,
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].d,
                                                                      shData.a,
                                                                      shData.b,
                                                                      shData.c,
                                                                      shData.d,
                                                                  )
                                                                    ? (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].point
                                                                    : 0
                                                                : checkAnswerAllFalse(
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].a,
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].b,
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].c,
                                                                      (
                                                                          answer?.answer as Array<Answer>
                                                                      )[index].d,
                                                                      shData.a,
                                                                      shData.b,
                                                                      shData.c,
                                                                      shData.d,
                                                                  )
                                                                ? (answer?.answer as Array<Answer>)[
                                                                      index
                                                                  ].point
                                                                : 0}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ),
                    showConfirmButton: false,
                    showCloseButton: true,
                    customClass: {
                        popup: "w-full h-full text-black dark:text-white bg-neutral-100 dark:bg-neutral-800",
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleExport = (sheetData: SheetShowDetail, type: "excel" | "csv") => {
        // สร้างข้อมูลสำหรับตารางแรก (ข้อมูลทั่วไป)
        const generalData = [
            [
                "รหัสนักศึกษา",
                `${(sheetData.predict_std_result as Array<number>).slice(0, 12).join("")}-${
                    (sheetData.predict_std_result as Array<number>)[12]
                }`,
            ],
            ["วิชา", group?.subject],
            ["ปีการศึกษา", `${group?.term}/${group?.year}`],
            ["กลุ่มการตรวจ", group?.name],
            ["ชุดเฉลย", answer?.name],
            ["กระดาษแม่แบบ", template?.name],
            ["วันที่ตรวจ", `${sheetData.updated_at}`],
            [], // แถวว่างสำหรับแบ่งตาราง
        ];

        // สร้างข้อมูลสำหรับตารางที่สอง (ผลลัพธ์การตรวจ)
        const resultData = [
            ["ข้อที่", "เฉลย", "ตอบ", "คะแนน"], // หัวตาราง
            ...(sheetData.predict_ans_result as Array<Choice>).map((shData, index) => [
                index + 1,
                `${(answer?.answer as Array<Answer>)[index].a ? "a " : ""}${
                    (answer?.answer as Array<Answer>)[index].b ? "b " : ""
                }${(answer?.answer as Array<Answer>)[index].c ? "c " : ""}${
                    (answer?.answer as Array<Answer>)[index].d ? "d " : ""
                }`,
                `${shData.a === 1 ? "a " : ""}${shData.b === 1 ? "b " : ""}${
                    shData.c === 1 ? "c " : ""
                }${shData.d === 1 ? "d " : ""}`,
                `${
                    (answer?.answer as Array<Answer>)[index].all
                        ? checkAnswerAllTrue(
                              (answer?.answer as Array<Answer>)[index].a,
                              (answer?.answer as Array<Answer>)[index].b,
                              (answer?.answer as Array<Answer>)[index].c,
                              (answer?.answer as Array<Answer>)[index].d,
                              shData.a,
                              shData.b,
                              shData.c,
                              shData.d,
                          )
                            ? (answer?.answer as Array<Answer>)[index].point
                            : 0
                        : checkAnswerAllFalse(
                              (answer?.answer as Array<Answer>)[index].a,
                              (answer?.answer as Array<Answer>)[index].b,
                              (answer?.answer as Array<Answer>)[index].c,
                              (answer?.answer as Array<Answer>)[index].d,
                              shData.a,
                              shData.b,
                              shData.c,
                              shData.d,
                          )
                        ? (answer?.answer as Array<Answer>)[index].point
                        : 0
                }`,
            ]),
        ];

        // รวมตารางข้อมูลทั่วไปและผลลัพธ์การตรวจเข้าด้วยกันใน worksheet เดียว
        const combinedData = [...generalData, ...resultData];

        // สร้าง workbook และ worksheet
        const wb = XLSX.utils.book_new(); // สร้างไฟล์ Excel ใหม่
        const ws = XLSX.utils.aoa_to_sheet(combinedData); // แปลงข้อมูลเป็น worksheet

        // เพิ่ม worksheet เข้าไปใน workbook
        XLSX.utils.book_append_sheet(wb, ws, "รวมข้อมูล");

        if (type === "excel") {
            // บันทึกและดาวน์โหลดไฟล์เป็น Excel
            XLSX.writeFile(wb, "Report.xlsx"); // บันทึกและให้ผู้ใช้ดาวน์โหลดไฟล์
        }

        if (type === "csv") {
            // บันทึกไฟล์ CSV
            XLSX.writeFile(wb, "Report.csv", { bookType: "csv" }); // กำหนดให้ไฟล์ที่บันทึกเป็น CSV
        }
    };

    const handleViewDetailAll = async () => {
        try {
            const fetchRes = await fetch(`/api/sheets/group/${group?.id}/detail`, {
                method: "GET",
            });
            const sheet = await fetchRes.json();
            if (sheet.success && sheet.data) {
                const sheetData: SheetShowDetail[] = sheet.data;

                MySwal.fire({
                    title: "รายละเอียดการตรวจ",
                    html: (
                        <div className="m-5">
                            <button
                                className="px-3 py-2 m-2 rounded-md bg-green-700 text-white hover:brightness-110"
                                onClick={() => {
                                    handleExportAll(sheetData, "excel");
                                }}
                            >
                                ส่งออกเป็น Excel
                            </button>
                            <button
                                className="px-3 py-2 m-2 rounded-md bg-blue-700 text-white hover:brightness-110"
                                onClick={() => {
                                    handleExportAll(sheetData, "csv");
                                }}
                            >
                                ส่งออกเป็น CSV
                            </button>
                            <div className="flex-grow">
                                <table className="my-4">
                                    <tbody>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                วิชา
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {group?.subject}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                ปีการศึกษา
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {`${group?.term}/${group?.year}`}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                กลุ่มการตรวจ
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {group?.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                ชุดเฉลย
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {answer?.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                กระดาษแม่แบบ
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {template?.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                จำนวนข้อ
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {answer?.total_no}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400 text-right px-3 py-1">
                                                คะแนนรวม
                                            </th>
                                            <td className="border border-neutral-700 dark:border-neutral-400 text-left px-3 py-1">
                                                {(answer?.answer as Array<Answer>).reduce(
                                                    (sum, answer) => sum + answer.point,
                                                    0,
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="my-4 w-full">
                                    <thead>
                                        <tr>
                                            <th className="border border-neutral-700 dark:border-neutral-400">
                                                ลำดับที่
                                            </th>
                                            <th className="border border-neutral-700 dark:border-neutral-400">
                                                รหัสนักศึกษา
                                            </th>
                                            <th className="border border-neutral-700 dark:border-neutral-400">
                                                คะแนนที่ได้
                                            </th>
                                            <th className="border border-neutral-700 dark:border-neutral-400">
                                                คิดเป็นร้อยละ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sheetData.map((shData, index) => (
                                            <tr key={index}>
                                                <td className="border border-neutral-700 dark:border-neutral-400">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-neutral-700 dark:border-neutral-400">
                                                    {`${(shData.predict_std_result as Array<number>)
                                                        .slice(0, 12)
                                                        .join("")}-${
                                                        (
                                                            shData.predict_std_result as Array<number>
                                                        )[12]
                                                    }`}
                                                </td>
                                                <td className="border border-neutral-700 dark:border-neutral-400">
                                                    {shData.total_score}
                                                </td>
                                                <td className="border border-neutral-700 dark:border-neutral-400">
                                                    {(shData.total_score * 100) /
                                                        (answer?.answer as Array<Answer>).reduce(
                                                            (sum, answer) => sum + answer.point,
                                                            0,
                                                        )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ),
                    showConfirmButton: false,
                    showCloseButton: true,
                    customClass: {
                        popup: "w-full h-full text-black dark:text-white bg-neutral-100 dark:bg-neutral-800",
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleExportAll = (sheetData: SheetShowDetail[], type: "excel" | "csv") => {
        // สร้างข้อมูลสำหรับตารางแรก (ข้อมูลทั่วไป)
        const generalData = [
            ["วิชา", group?.subject],
            ["ปีการศึกษา", `${group?.term}/${group?.year}`],
            ["กลุ่มการตรวจ", group?.name],
            ["ชุดเฉลย", answer?.name],
            ["กระดาษแม่แบบ", template?.name],
            ["จำนวนข้อ", answer?.total_no],
            [
                "คะแนนรวม",
                (answer?.answer as Array<Answer>).reduce((sum, ans) => sum + ans.point, 0),
            ],
            [], // แถวว่างสำหรับแยกข้อมูล
        ];

        // สร้างข้อมูลสำหรับตารางที่สอง (ผลลัพธ์การตรวจ)
        const resultData = [
            ["ลำดับที่", "รหัสนักศึกษา", "คะแนนที่ได้", "คิดเป็นร้อยละ"], // หัวตาราง
            ...sheetData.map((shData, index) => [
                index + 1, // ลำดับที่
                `${(shData.predict_std_result as Array<number>).slice(0, 12).join("")}-${
                    (shData.predict_std_result as Array<number>)[12]
                }`, // รหัสนักศึกษา
                shData.total_score, // คะแนนที่ได้
                (shData.total_score * 100) /
                    (answer?.answer as Array<Answer>).reduce((sum, ans) => sum + ans.point, 0), // คิดเป็นร้อยละ
            ]),
        ];

        // รวมข้อมูลทั่วไปและผลลัพธ์การตรวจเข้าด้วยกันใน worksheet เดียว
        const combinedData = [...generalData, ...resultData];

        // สร้าง workbook และ worksheet
        const wb = XLSX.utils.book_new(); // สร้างไฟล์ Excel ใหม่
        const ws = XLSX.utils.aoa_to_sheet(combinedData); // แปลงข้อมูลเป็น worksheet

        // เพิ่ม worksheet เข้าไปใน workbook
        XLSX.utils.book_append_sheet(wb, ws, "ข้อมูลและผลลัพธ์การตรวจ");

        if (type === "excel") {
            // บันทึกและดาวน์โหลดไฟล์เป็น Excel
            XLSX.writeFile(wb, "Report.xlsx"); // บันทึกและให้ผู้ใช้ดาวน์โหลดไฟล์
        }

        if (type === "csv") {
            // บันทึกไฟล์ CSV
            XLSX.writeFile(wb, "Report.csv", { bookType: "csv" }); // กำหนดให้ไฟล์ที่บันทึกเป็น CSV
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    useEffect(() => {
        if (group) {
            const fetchTemplateAndAnswerData = async () => {
                try {
                    const [templateRes, answerRes] = await Promise.all([
                        fetch(`/api/templates/${group.templates.id}`, { method: "GET" }),
                        fetch(`/api/answers/${group.answers.id}`, { method: "GET" }),
                    ]);
                    const templateData = await templateRes.json();
                    const answerData = await answerRes.json();
                    if (templateData.success && templateData.data) setTemplate(templateData.data);
                    if (answerData.success && answerData.data) setAnswer(answerData.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchTemplateAndAnswerData();
        }
    }, [group]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (loop) {
            fetchGroupData();
            intervalId = setInterval(() => {
                fetchGroupData();
            }, 1000); // 1 วินาที
        }

        return () => clearInterval(intervalId);
    }, [fetchGroupData, loop]);

    return (
        <div className="flex flex-col gap-2 container mx-auto">
            <button
                onClick={() => handerPredict()}
                className="py-2 px-3 m-1 rounded-lg text-white bg-purple-600 hover:brightness-90"
            >
                ตรวจทุกแผ่น
            </button>
            <table className="border-2">
                <thead>
                    <tr className="border">
                        <td colSpan={5}>
                            <div className=" flex justify-between items-center px-4 py-1">
                                <span>ตารางการตรวจ</span>
                                <button
                                    className="px-3 py-2 rounded-md text-white bg-green-700 hover:brightness-125"
                                    onClick={() => {
                                        handleViewDetailAll();
                                    }}
                                >
                                    ผลการตรวจแบบภาพรวม
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className="border">
                        <td className="text-center p-2">แผ่นที่</td>
                        <td className="text-center p-2">รูป</td>
                        <td className="text-center p-2">สถานะ</td>
                        <td className="text-center p-2">ผลการตรวจ</td>
                        <td className="text-center p-2">การกระทำ</td>
                    </tr>
                </thead>
                <tbody>
                    {group?.sheets.map((img, idx) => (
                        <tr key={img.id} className="border">
                            <td className="text-center">{idx + 1}</td>
                            <td>
                                <NextImage
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${img.name}`}
                                    alt={`Image ${img.id}`}
                                    width={100}
                                    height={100}
                                    className="mx-auto"
                                />
                            </td>
                            <td className="text-center">{img.status}</td>
                            <td className="text-center">
                                {img.status != "completed" ? (
                                    <button className="px-7 py-2 rounded-md text-white bg-gray-700">
                                        ดู
                                    </button>
                                ) : (
                                    <button
                                        className="px-7 py-2 rounded-md text-white bg-green-700 hover:brightness-125"
                                        onClick={() =>
                                            handleViewDetail(
                                                img.id,
                                                `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${img.name}`,
                                            )
                                        }
                                    >
                                        ดู
                                    </button>
                                )}
                            </td>
                            <td className="text-center">
                                <button
                                    className="px-5 py-2 rounded-md text-white bg-red-700 hover:brightness-125"
                                    onClick={() => {
                                        hendlerDelete(img.id);
                                    }}
                                >
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
