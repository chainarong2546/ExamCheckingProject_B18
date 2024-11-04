"use client";
import React, { useEffect, useState } from "react";
import ShowError from "@/components/ShowError";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupUploadFile from "./GroupUploadFile";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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

type OptionType = {
    value: number;
    label: string;
};

type Props = {
    params: {
        id: string;
    };
};

export default function GroupDetail_Page({ params }: Props) {
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [year, setYear] = useState<number>(new Date().getUTCFullYear() + 543);
    const [term, setTerm] = useState<number>(1);
    const [selectedTemplate, setSelectedTemplate] = useState<OptionType | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<OptionType | null>(null);
    const [createAt, setCreateAt] = useState<Date>();
    const [updateAt, setUpdateAt] = useState<Date>();

    const handleUpdate = async () => {
        if (name.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอก ชื่อกลุ่ม",
            });
            return;
        }
        if (subject.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอก วิชา",
            });
            return;
        }

        if (!selectedTemplate?.value) {
            Swal.fire({
                icon: "warning",
                title: "โปรดเลือก แม่แบบกระดาษคำตอบ",
            });
            return;
        }

        if (!selectedAnswer?.value) {
            Swal.fire({
                icon: "warning",
                title: "โปรดเลือก ชุดเฉลย",
            });
            return;
        }

        const groupData = {
            name: name,
            subject: subject,
            year: year,
            term: term,
        };

        try {
            const fetchRes = await fetch(`/api/groups/${params.id}`, {
                method: "PUT",
                body: JSON.stringify(groupData),
            });
            const data = await fetchRes.json();
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.message,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.message,
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "การอัปเดตกลุ่มการตรวจล้มเหลว",
            });
        }
    };

    const handlerDelete = async () => {
        Swal.fire({
            title: "คุณต้องการลบกลุ่มใช้หรือไม่",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "ลบ",
            denyButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const fetchRes = await fetch(`/api/groups/${params.id}`, {
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
                        router.push("/dashboard/groups");
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
            const fetchGroup = async () => {
                try {
                    const fetchRes = await fetch(`/api/groups/${params.id}`, {
                        method: "GET",
                    });
                    const data = (await fetchRes.json()) as {
                        success: boolean;
                        message: string;
                        data: GroupShowDetail;
                    };
                    if (data.success) {
                        if (data.data) {
                            setErrorMsg(null);
                            setName(data.data.name);
                            setSubject(data.data.subject);
                            setYear(data.data.year);
                            setTerm(data.data.term);
                            setSelectedTemplate({
                                value: data.data.templates.id,
                                label: data.data.templates.name,
                            });
                            setSelectedAnswer({
                                value: data.data.answers.id,
                                label: data.data.answers.name,
                            });
                            setCreateAt(data.data.created_at);
                            setUpdateAt(data.data.updated_at);
                        } else {
                            setErrorMsg("ไม่พบข้อมูล");
                        }
                    } else {
                        setErrorMsg(data.message);
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchGroup();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, [params.id]);

    return (
        <>
            {loading ? (
                <p>กำลังโหลด...</p>
            ) : errorMsg ? (
                <ShowError msg={errorMsg} />
            ) : (
                <div className="p-2 my-2">
                    <div className="flex justify-between">
                        <div>
                            <p>สร้างเมื่อ : {createAt?.toLocaleString()}</p>
                            <p>อัพเดทเมื่อ : {updateAt?.toLocaleString()}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p>ชื่อกลุ่ม</p>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <p>วิชา</p>
                            <input
                                type="text"
                                placeholder="Subject"
                                value={subject}
                                className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
                                onChange={(event) => {
                                    setSubject(event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <p>ปีการศึกษา</p>
                            <input
                                type="number"
                                placeholder="Year"
                                value={year}
                                className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
                                onChange={(event) => {
                                    const value = event.target.value
                                        ? parseInt(event.target.value, 10)
                                        : 1;
                                    setYear(value);
                                }}
                                onBlur={(event) => {
                                    const value = event.target.value
                                        ? parseInt(event.target.value, 10)
                                        : 1;
                                    const yearNow = new Date().getFullYear() + 553;
                                    setYear(
                                        value < 2500 ? 2500 : value > yearNow ? yearNow : value,
                                    );
                                }}
                            />
                        </div>
                        <div>
                            <p>เทอม</p>
                            <select
                                value={term}
                                className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
                                onChange={(event) => {
                                    const value = parseInt(event.target.value, 10);
                                    setTerm(value);
                                }}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                        </div>
                        <div>
                            <p>แม่แบบกระดาษคำตอบ</p>
                            <div className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:border-neutral-600">
                                {selectedTemplate?.label}
                            </div>
                        </div>
                        <div>
                            <p>ชุดเฉลย</p>

                            <div className="w-full pl-4 pr-10 py-2 border-b border-b-neutral-300 bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:border-neutral-600">
                                {selectedAnswer?.label}
                            </div>
                        </div>
                    </div>
                    <button
                        className="py-2 px-5 my-3 rounded-lg bg-green-600 hover:brightness-90"
                        onClick={() => {
                            handleUpdate();
                        }}
                    >
                        อัพเดท
                    </button>

                    <hr className="m-2" />
                    {!selectedTemplate || !selectedAnswer ? (
                        <p>
                            ไม่สามารถอัปโหลดรูปภาพได้เนื่องจากไม่พบแม่แบบกระดาษคำตอบและเฉลย
                        </p>
                    ) : (
                        <GroupUploadFile
                            group_id={Number(params.id)}
                            template_id={selectedTemplate.value}
                            answer_id={selectedAnswer.value}
                        />
                    )}
                </div>
            )}
        </>
    );
}
