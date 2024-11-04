"use client";
import React, { useEffect, useState, useTransition } from "react";
import * as pdfjsLib from "pdfjs-dist";
import NextImage from "next/image";
import selectTemplateShowDetail from "@/actions/selectTemplateShowDetail";
import selectSheetShowGroup from "@/actions/selectSheetShowGroup";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
    import.meta.url,
).toString();

// สถานะของไฟล์ PDF และภาพจากแต่ละหน้า
type ImagesWithStatus = {
    image: string;
    status:
        | "selected"
        | "checking"
        | "support"
        | "not support"
        | "uploading"
        | "uploaded"
        | "upload fail";
};

type Props = {
    group_id: number;
    template_id: number;
    answer_id: number;
};

export default function PDFUploader({ group_id, template_id }: Props) {
    const [marker_tl_suqare, setMarker_tl_suqare] = useState<Square>();
    const [marker_tr_suqare, setMarker_tr_suqare] = useState<Square>();
    const [marker_bl_suqare, setMarker_bl_suqare] = useState<Square>();
    const [marker_br_suqare, setMarker_br_suqare] = useState<Square>();
    const [marker_qr_suqare, setMarker_qr_suqare] = useState<Square>();
    const [marker_qr_data, setMarker_qr_data] = useState<string>();
    const [marker_tl_center2, setMarker_tl_center2] = useState<Point>();
    const [marker_tr_center2, setMarker_tr_center2] = useState<Point>();
    const [marker_bl_center2, setMarker_bl_center2] = useState<Point>();
    const [marker_br_center2, setMarker_br_center2] = useState<Point>();

    const [images, setImages] = useState<ImagesWithStatus[]>([]);
    const [oldImages, setOldImages] = useState<{ id: number; name: string }[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, startTransition] = useTransition();

    // ฟังก์ชันสำหรับจัดการการเลือกไฟล์ PDF
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            selectedFiles.forEach(async (file) => {
                if (
                    file.type === "image/png" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg"
                ) {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        const result = fileReader.result;
                        if (typeof result === "string") {
                            const img = new Image();
                            img.onload = () => {
                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");
                                canvas.width = img.width;
                                canvas.height = img.height;
                                context?.drawImage(img, 0, 0);

                                const imageDataURL = canvas.toDataURL(); // แปลงเป็น Data URL

                                // เพิ่มรูปใหม่ลงใน state
                                setImages((prev) => {
                                    const newImage: ImagesWithStatus = {
                                        image: imageDataURL,
                                        status: "selected",
                                    };
                                    const updatedImages = [...prev, newImage];
                                    return updatedImages;
                                });
                            };
                            img.src = result; // ใช้ Data URL ที่ได้จาก FileReader
                        } else {
                            console.error("ไม่สามารถอ่านไฟล์ได้");
                        }
                    };
                    fileReader.readAsDataURL(file);
                } else if (file.type === "application/pdf") {
                    const fileReader = new FileReader();
                    fileReader.onload = async () => {
                        const result = fileReader.result;
                        if (result instanceof ArrayBuffer) {
                            const typedArray = new Uint8Array(result);
                            const pdf = await pdfjsLib.getDocument(typedArray).promise;
                            const numPages = pdf.numPages;

                            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                                const page = await pdf.getPage(pageNum);
                                const viewport = page.getViewport({ scale: 2 });
                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                const renderContext = {
                                    canvasContext: context!,
                                    viewport: viewport,
                                };

                                await page.render(renderContext).promise;

                                const imageDataURL = canvas.toDataURL();
                                setImages((prev) => {
                                    const newImage: ImagesWithStatus = {
                                        image: imageDataURL,
                                        status: "selected",
                                    };
                                    const updatedImages = [...prev, newImage];
                                    return updatedImages;
                                });
                            }
                        } else {
                            console.error("ไม่สามารถอ่านไฟล์ PDF ได้");
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                } else {
                    console.error("ไม่รองรับไฟล์นี้");
                }
            });
        }
    };

    // ฟังก์ชันตรวจสอบความเข้ากันได้ของรูปภาพ
    const checkCompatibility = async (imageDataURL: string) => {
        const formData = new FormData();

        // แปลงข้อมูลจาก state ใส่ใน formData
        formData.append("marker_tl_square", JSON.stringify(marker_tl_suqare));
        formData.append("marker_tr_square", JSON.stringify(marker_tr_suqare));
        formData.append("marker_bl_square", JSON.stringify(marker_bl_suqare));
        formData.append("marker_br_square", JSON.stringify(marker_br_suqare));
        formData.append("marker_qr_square", JSON.stringify(marker_qr_suqare));
        formData.append("marker_qr_data", marker_qr_data || "");
        formData.append("marker_tl_center", JSON.stringify(marker_tl_center2));
        formData.append("marker_tr_center", JSON.stringify(marker_tr_center2));
        formData.append("marker_bl_center", JSON.stringify(marker_bl_center2));
        formData.append("marker_br_center", JSON.stringify(marker_br_center2));

        // ถ้าส่งรูปเป็น base64 ก็ใส่ไปใน formData
        formData.append("image_data_url", imageDataURL || "");

        try {
            // ส่งข้อมูลไปยัง API ผ่าน multipart/form-data
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_IMAGE_PROCESS_API_URL}/tool/checkCompatibilityAndAdjustImageForUploadFileAtGroup`,
                {
                    method: "POST",
                    body: formData, // ส่ง formData
                },
            );

            if (response.ok) {
                const res = await response.json();
                // ถ้ารูปภาพ supported เป็น true ให้ส่งไปอัปโหลด
                if (
                    res.data.marker_tl.supported &&
                    res.data.marker_tr.supported &&
                    res.data.marker_bl.supported &&
                    res.data.marker_br.supported
                ) {
                    return {
                        supported: true,
                    };
                }
                return {
                    supported: false,
                };
            } else {
                console.error("Error from API:", response.status);
                return {
                    supported: false,
                };
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการตรวจสอบความเข้ากันได้:", error);
            return {
                supported: false,
            };
        }
    };

    const dataURLToBlob = async (dataURL: string) => {
        const res = await fetch(dataURL);
        const blob = await res.blob();
        return blob;
    };

    // ฟังก์ชันสำหรับอัปโหลดรูปภาพที่ผ่านการตรวจสอบแล้ว
    const uploadImage = async (imageDataURL: string) => {
        const imageBlob = await dataURLToBlob(imageDataURL);

        try {
            const imgFormData = new FormData();
            imgFormData.append("image", imageBlob);

            const fetchRes = await fetch(`/api/uploadImageForGroup`, {
                method: "POST",
                body: imgFormData,
            });
            const data = (await fetchRes.json()) as CustomReturnType<{ image_name: string }>;
            if (data.success && data.data !== undefined) {
                const filename = data.data.image_name;
                console.log(filename);

                try {
                    const fetchRes = await fetch("/api/sheets", {
                        method: "POST",
                        body: JSON.stringify({
                            name: filename,
                            group_id: group_id,
                        }),
                    });
                    const data = await fetchRes.json();
                    if (data.success && data.data) {
                        console.log("เพิ่มกระดาษคำตอบสำเร็จ");
                    }
                } catch (error) {
                    console.error(error);
                }
                return true;
            } else {
                console.error("ล้มเหลวในการอัปโหลดภาพ");
                return false;
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:", error);
            return false;
        }
    };

    const handleUploadImage = () => {
        images.forEach(async (img, index) => {
            if (img.status === "selected") {
                setImages((prev) => {
                    const newState = [...prev];
                    newState[index].status = "checking";
                    newState[index].image = newState[index].image;
                    return newState;
                });
                const res = await checkCompatibility(img.image);
                setImages((prev) => {
                    const newState = [...prev];
                    newState[index].status = res.supported ? "support" : "not support";
                    newState[index].image = newState[index].image;
                    return newState;
                });
                if (res.supported) {
                    setImages((prev) => {
                        const newState = [...prev];
                        newState[index].status = "uploading";
                        newState[index].image = newState[index].image;
                        return newState;
                    });
                    const uploadRes = await uploadImage(img.image);

                    if (uploadRes) {
                        setImages((prev) => {
                            const newState = [...prev];
                            newState[index].status = "uploaded";
                            newState[index].image = newState[index].image;
                            return newState;
                        });
                    } else {
                        setImages((prev) => {
                            const newState = [...prev];
                            newState[index].status = "upload fail";
                            newState[index].image = newState[index].image;
                            return newState;
                        });
                    }
                } else {
                    console.log("not support");
                }
            }
        });
    };

    useEffect(() => {
        startTransition(async () => {
            const data = await selectTemplateShowDetail(template_id);
            if (data.success) {
                setMarker_tl_suqare(data.data?.marker_tl as Square);
                setMarker_tr_suqare(data.data?.marker_tr as Square);
                setMarker_bl_suqare(data.data?.marker_bl as Square);
                setMarker_br_suqare(data.data?.marker_br as Square);
                setMarker_qr_suqare(data.data?.marker_qr as Square);
                setMarker_qr_data(data.data?.marker_qr_data);
                setMarker_tl_center2(data.data?.marker_tl_center as Point);
                setMarker_tr_center2(data.data?.marker_tr_center as Point);
                setMarker_bl_center2(data.data?.marker_bl_center as Point);
                setMarker_br_center2(data.data?.marker_br_center as Point);
            }
        });
    }, [template_id]);

    useEffect(() => {
        startTransition(async () => {
            const data = await selectSheetShowGroup(group_id);
            if (data.success && data.data) {
                setOldImages(data.data);
            }
        });
    }, [group_id]);

    return (
        <div className="pdf-uploader">
            <h1>อัปโหลด PDF และแสดงรูปภาพของทุกหน้า</h1>

            {/* ปุ่มเลือกไฟล์ PDF */}
            <input
                type="file"
                accept="application/pdf, image/jpeg, image/png"
                onChange={handleFileSelect}
                multiple
            />

            {/* แสดงรายการของหน้าภายใน PDF */}
            <div className="grid grid-cols-8 gap-2">
                {images.map((img, index) => (
                    <div key={index}>
                        <NextImage
                            key={index}
                            src={img.image}
                            alt={`Image ${index + 1}`}
                            width={200}
                            height={200}
                        />
                        <p
                            className={`text-sm ${
                                img.status === "selected"
                                    ? "bg-gray-500"
                                    : img.status === "not support" || img.status === "upload fail"
                                    ? "bg-red-600"
                                    : img.status === "uploaded" || img.status === "support"
                                    ? "bg-green-600"
                                    : "bg-yellow-500"
                            }`}
                        >
                            Status: {img.status}
                        </p>
                    </div>
                ))}
            </div>
            <button
                className=" m-5 px-3 py-2 bg-blue-700 text-white rounded-md"
                onClick={() => handleUploadImage()}
            >
                อัปโหลด
            </button>

            <hr />
            <h1>อัปโหลดแล้ว</h1>
            <div className="grid grid-cols-8 gap-2">
                {oldImages.map((img) => (
                    <div key={img.id}>
                        <NextImage
                            src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${img.name}`}
                            alt={`Image ${img.id}`}
                            width={200}
                            height={200}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
