"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ShowError from "@/components/ShowError";
import Link from "next/link";
import Image from "next/image";

type TemplatesShowDetail = {
    id: number;
    name: string;
    total_no: number;
    image_url: string;
    marker_qr_data: string;
}[];

type Props = object;

export default function ShowTemplate({}: Props) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [templates, setTemplates] = useState<TemplatesShowDetail>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        try {
            const fetchTemplate = async () => {
                const fetchRes = await fetch("/api/templates", {
                    method: "GET",
                });
                const data = await fetchRes.json();
                if (data.success) {
                    setTemplates(data.data);
                    setErrorMsg(null);
                } else {
                    setTemplates([]);
                    setErrorMsg(data.message);
                }
            };
            fetchTemplate();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    return (
        <>
            <div className="relative max-w-md m-2 ms-auto">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-2 text-sm border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-300"
                >
                    <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                </button>
            </div>

            {loading ? (
                <p>กำลังโหลด...</p>
            ) : errorMsg !== null ? (
                <ShowError msg={errorMsg} />
            ) : templates.length == 0 ? (
                <p>ไม่มีแม่แบบกระดาษคำตอบที่สร้างไว้</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                    {templates.map((template, index) => (
                        <Link key={index} href={`/dashboard/template/${template.id}`}>
                            <div className="min-h-24 p-2 border rounded-md shadow-md border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 hover:brightness-90">
                                <p>
                                    <b>{template.name}</b>
                                </p>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/${template.image_url}`}
                                    alt={`${template.image_url}`}
                                    width={300}
                                    height={500}
                                    className="mx-auto"
                                />
                                <ul className="shadow-sm p-2 m-2 bg-neutral-50 dark:bg-neutral-900">
                                    <li>
                                        <b>ข้อมูล QR Code :</b> {template.marker_qr_data}
                                    </li>
                                    <li>
                                        <b>จำนวนข้อทั้งหมด :</b> {template.total_no}
                                    </li>
                                </ul>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
