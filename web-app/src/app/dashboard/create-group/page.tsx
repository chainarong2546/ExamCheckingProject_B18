"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

type OptionType = {
    value: number;
    label: string;
};

type SelectTemplate = {
    id: number;
    name: string;
    total_no: number;
    image_url: string;
    marker_qr_data: string;
}[];

type SelectAnswer = {
    id: number;
    name: string;
    subject: string;
    year: number;
    term: number;
    total_no: number;
}[];

type Props = object;

export default function CreateGroup({}: Props) {
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [year, setYear] = useState<number>(new Date().getUTCFullYear() + 543);
    const [term, setTerm] = useState<number>(1);

    const [templates, setTemplates] = useState<SelectTemplate>([]);
    const [answers, setAnswers] = useState<SelectAnswer>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<OptionType | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<OptionType | null>(null);

    useEffect(() => {
        const fetchAnswerAndTemplate = async () => {
            const [response1, response2] = await Promise.all([
                fetch("/api/templates", {
                    method: "GET",
                }),
                fetch("/api/answers", {
                    method: "GET",
                }),
            ]);

            if (response1.ok && response2.ok) {
                const data1 = await response1.json();
                const data2 = await response2.json();

                if (data1.success && data1.data && data2.success && data2.data) {
                    setTemplates(data1.data);
                    setAnswers(data2.data);
                }
            }
        };
        fetchAnswerAndTemplate();
    }, []);

    const handleCreate = async () => {
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
                title: "กรุณาเลือก แม่แบบกระดาษคำตอบ",
            });
            return;
        }

        if (!selectedAnswer?.value) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเลือก ชุดเฉลย",
            });
            return;
        }

        const groupData = {
            name: name,
            subject: subject,
            year: year,
            term: term,
            template_id: selectedTemplate?.value,
            answer_id: selectedAnswer?.value,
        };

        try {
            const fetchRes = await fetch("/api/groups", {
                method: "POST",
                body: JSON.stringify(groupData),
            });
            const data = await fetchRes.json();
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.message,
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    router.push("/dashboard/groups");
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
                title: "สร้างกลุ่มการตรวจไม่สำเร็จ",
            });
        }
    };

    return (
        <div className="p-2 my-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p>ชื่อกลุ่ม</p>
                    <input
                        type="text"
                        placeholder="ชื่อกลุ่ม"
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
                            const value = event.target.value ? parseInt(event.target.value, 10) : 1;
                            setYear(value);
                        }}
                        onBlur={(event) => {
                            const value = event.target.value ? parseInt(event.target.value, 10) : 1;
                            const yearNow = new Date().getFullYear() + 553;
                            setYear(value < 2500 ? 2500 : value > yearNow ? yearNow : value);
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
                    <Select
                        value={selectedTemplate}
                        onChange={(selectedOption) => {
                            setSelectedTemplate(selectedOption);
                        }}
                        options={templates.map((template) => ({
                            value: template.id,
                            label: template.name,
                        }))}
                        isSearchable
                        className="w-full"
                        placeholder="Select a template..."
                    />
                </div>
                <div>
                    <p>ชุดเฉลย</p>
                    <Select
                        value={selectedAnswer}
                        onChange={(selectedOption) => {
                            setSelectedAnswer(selectedOption);
                        }}
                        options={answers.map((answer) => ({
                            value: answer.id,
                            label: answer.name,
                        }))}
                        isSearchable
                        className="w-full"
                        placeholder="Select a template..."
                    />
                </div>
            </div>

            <hr className="my-5" />

            <button
                className="py-2 px-5 rounded-lg bg-green-600 hover:brightness-90"
                onClick={() => {
                    handleCreate();
                }}
            >
                สร้าง
            </button>
        </div>
    );
}
