"use client";
import React, { useEffect, useState } from "react";
import ShowError from "@/components/ShowError";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

type Props = {
    params: {
        id: string;
    };
};

export default function AnswerDetail_Page({ params }: Props) {
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [year, setYear] = useState<number>(new Date().getUTCFullYear() + 543);
    const [term, setTerm] = useState<number>(1);
    const [totalNo, setTotalNo] = useState<number>(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [createAt, setCreateAt] = useState<Date>();
    const [updateAt, setUpdateAt] = useState<Date>();

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleCheckboxChange = (index: number, label: "a" | "b" | "c" | "d" | "all") => {
        if (answers) {
            const nextState = answers.map((value, index2) => {
                if (index === index2) {
                    // อัปเดตค่า checkbox ที่ถูกเปลี่ยน
                    const updatedValue = {
                        ...value,
                        [label]: !value[label],
                    };

                    // นับจำนวนตัวเลือกที่ถูกเลือก
                    const selectedCount = [
                        updatedValue.a,
                        updatedValue.b,
                        updatedValue.c,
                        updatedValue.d,
                    ].filter(Boolean).length;

                    // อัปเดตค่า answer.all อัตโนมัติ ถ้าเลือก 1 ข้อ all จะเป็น true
                    if (selectedCount === 1) {
                        updatedValue.all = true;
                    }

                    return updatedValue;
                }
                return value;
            });
            setAnswers(nextState);
        }
    };

    const handlePointChange = (index: number, point: number) => {
        if (answers) {
            const nextState = answers.map((value, index2) => {
                if (index == index2) {
                    return {
                        ...value,
                        point: point,
                    };
                }
                return value;
            });
            setAnswers(nextState);
        }
    };

    const checkRuleDisable = (value: Answer) => {
        let count = 0;
        if (value.a) count++;
        if (value.b) count++;
        if (value.c) count++;
        if (value.d) count++;
        if (count > 1) return false;

        return true;
    };

    const handleUpdate = () => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];

            // ถ้าจำนวน totalNo มากกว่า answers เดิม, ให้เพิ่มข้อมูลใหม่
            if (totalNo > prevAnswers.length) {
                for (let i = prevAnswers.length; i < totalNo; i++) {
                    updatedAnswers.push({
                        a: false,
                        b: false,
                        c: false,
                        d: false,
                        point: 1,
                        all: true,
                    });
                }
            }

            // ถ้าจำนวน totalNo น้อยกว่า answers เดิม, ให้ตัดข้อมูลส่วนเกินออก
            if (totalNo < prevAnswers.length) {
                updatedAnswers.length = totalNo; // ตัดขนาด array ให้เท่ากับ totalNo
            }

            return updatedAnswers;
        });
    };

    const handlerSave = async () => {
        if (name.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "กรุณากรอก ชื่อเฉลย",
            });
            return;
        }
        if (subject.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "กรุณากรอก วิชา",
            });
            return;
        }

        const allTrueIndexes = answers
            .map((answer, index) =>
                !(answer.a || answer.b || answer.c || answer.d) ? index + 1 : -1,
            )
            .filter((index) => index !== -1);

        if (allTrueIndexes.length > 0) {
            Swal.fire({
                icon: "warning",
                title: `โปรดเลือกอย่างน้อยหนึ่งตัวเลือก (a, b, c หรือ d) ในข้อ ${allTrueIndexes.toString()}`,
            });
            return;
        }

        if (!answers.every((answer) => answer.a || answer.b || answer.c || answer.d)) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "โปรดเลือกอย่างน้อยหนึ่งตัวเลือก (a, b, c หรือ d) สำหรับแต่ละคำตอบ",
            });
            return;
        }

        // ถ้าผ่านการตรวจสอบ ก็ทำการบันทึกได้
        const answerData = {
            name: name,
            subject: subject,
            year: year,
            term: term,
            total_no: totalNo,
            answer: answers,
        };

        const fetchRes = await fetch(`/api/answers/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(answerData),
        });

        const data = await fetchRes.json();
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                router.push("/dashboard/answers");
            });
        } else {
            Swal.fire({
                icon: "error",
                title: data.message,
            });
        }
    };

    const handlerDelete = async () => {
        Swal.fire({
            title: "คุณต้องการลบเฉลยใช่หรือไม่",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "ลบ",
            denyButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const fetchRes = await fetch(`/api/answers/${params.id}`, {
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
                        router.push("/dashboard/answers");
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
                    title: "การเปลี่ยนแปลงจะไม่ถูกบันทึก",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    useEffect(() => {
        setLoading(true);
        const fetchAnswer = async () => {
            try {
                const fetchRes = await fetch(`/api/answers/${params.id}`, {
                    method: "GET",
                });
                const data = (await fetchRes.json()) as {
                    success: boolean;
                    message: string;
                    data: AnswerShowDetail;
                };
                if (data.success) {
                    if (data.data) {
                        setErrorMsg(null);
                        setName(data.data.name);
                        setSubject(data.data.subject);
                        setYear(data.data.year);
                        setTerm(data.data.term);
                        setTotalNo(data.data.total_no);
                        setAnswers(data.data.answer as Answer[]);
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
        fetchAnswer();
        setLoading(false);
    }, [params.id]);

    return (
        <>
            {errorMsg ? (
                <ShowError msg={errorMsg || ""} />
            ) : loading ? (
                <p>กำลังโหลด....</p>
            ) : (
                <div className="p-2 my-2">
                    <div className="flex justify-between">
                        <div>
                            <p>สร้างเมื่อ : {createAt?.toLocaleString()}</p>
                            <p>อัพเดตเมื่อ : {updateAt?.toLocaleString()}</p>
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
                            <p>ชื่อเฉลย</p>
                            <input
                                type="text"
                                placeholder="ชื่อเฉลย"
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
                                placeholder="วิชา"
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
                                placeholder="ปีการศึกษา"
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
                    </div>
                    <hr className="my-5" />

                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={totalNo}
                            min={0}
                            max={100}
                            className="pl-4 pr-10 py-2 border-b border-b-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
                            onChange={(event) => {
                                const value = event.target.value
                                    ? parseInt(event.target.value, 10)
                                    : 0;
                                setTotalNo(value);
                            }}
                            onBlur={(event) => {
                                const value = event.target.value
                                    ? parseInt(event.target.value, 10)
                                    : 0;
                                setTotalNo(value < 0 ? 0 : value > 100 ? 100 : value);
                            }}
                        />
                        <button
                            className="py-2 px-3 rounded-lg bg-blue-600 hover:brightness-90"
                            onClick={() => {
                                handleUpdate();
                            }}
                        >
                            อัพเดตจำนวนข้อทั้งหมด
                        </button>
                    </div>
                    <table className="w-full my-4 px-2 border text-left">
                        <thead>
                            <tr>
                                <th className="px-2">ลำดับที่</th>
                                <th className="px-2">คำตอบ</th>
                                <th className="px-2">คะแนน</th>
                                <th className="px-2">ตัวเลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answers.map((answer, index) => (
                                <tr key={index}>
                                    <td className="px-2"> {`${index + 1}.`} </td>
                                    <td className="px-2">
                                        <div className="flex gap-3">
                                            <div>
                                                <span className="px-2">ก</span>
                                                <input
                                                    type="checkbox"
                                                    checked={answer.a}
                                                    onChange={() =>
                                                        handleCheckboxChange(index, "a")
                                                    }
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                            <div>
                                                <span className="px-2">ข</span>
                                                <input
                                                    type="checkbox"
                                                    checked={answer.b}
                                                    onChange={() =>
                                                        handleCheckboxChange(index, "b")
                                                    }
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                            <div>
                                                <span className="px-2">ค</span>
                                                <input
                                                    type="checkbox"
                                                    checked={answer.c}
                                                    onChange={() =>
                                                        handleCheckboxChange(index, "c")
                                                    }
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                            <div>
                                                <span className="px-2">ง</span>
                                                <input
                                                    type="checkbox"
                                                    checked={answer.d}
                                                    onChange={() =>
                                                        handleCheckboxChange(index, "d")
                                                    }
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2">
                                        <input
                                            type="number"
                                            value={answer.point}
                                            className="text-neutral-900 max-w-12"
                                            onChange={(event) => {
                                                const value = event.target.value
                                                    ? parseInt(event.target.value, 10)
                                                    : 1;
                                                handlePointChange(
                                                    index,
                                                    value < 1 ? 1 : value > 10 ? 10 : value,
                                                );
                                            }}
                                        />
                                        <span className="px-2">คะแนน</span>
                                    </td>
                                    <td className="px-2">
                                        <input
                                            type="checkbox"
                                            disabled={checkRuleDisable(answer)}
                                            checked={answer.all}
                                            onChange={() => {
                                                handleCheckboxChange(index, "all");
                                            }}
                                            className="h-5 w-5"
                                        />
                                        <span className="px-2">ต้องถูกต้องทุกข้อ</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="py-2 px-5 rounded-lg bg-green-600 hover:brightness-90"
                        onClick={() => {
                            handlerSave();
                        }}
                    >
                        อัพเดต
                    </button>
                </div>
            )}
        </>
    );
}
