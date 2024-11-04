"use client";
import React, { useEffect, useState } from "react";
import ShowError from "@/components/ShowError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = object;

type AnswerShowDetail = {
    id: number;
    name: string;
    subject: string;
    year: number;
    term: number;
    total_no: number;
}[];

export default function Answers_Page({}: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [answers, setAnswers] = useState<AnswerShowDetail>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchAnswers = async () => {
            try {
                const fetchRes = await fetch("/api/answers", {
                    method: "GET",
                });
                const data = await fetchRes.json();
                if (data.success) {
                    setAnswers(data.data);
                    setErrorMsg(null);
                } else {
                    setAnswers([]);
                    setErrorMsg(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchAnswers();
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
            {errorMsg ? (
                <ShowError msg={errorMsg || ""} />
            ) : loading ? (
                <p>กำลังโหลด....</p>
            ) : answers.length == 0 ? (
                <p>ไม่มีเฉลยที่สร้างไว้</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {answers.map((answer, index) => (
                        <Link key={index} href={`/dashboard/answer/${answer.id}`}>
                            <div className="min-h-24 p-2 border rounded-md shadow-md border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 hover:brightness-90 dark:hover:hover:brightness-110">
                                <p>
                                    <b>{answer.name}</b>
                                </p>
                                <ul className="shadow-sm p-2 m-2 bg-neutral-50 dark:bg-neutral-900">
                                    <li>
                                        <b> วิชา: </b> {answer.subject}
                                    </li>
                                    <li>
                                        <b> ปีการศึกษา: </b> {answer.year}
                                    </li>
                                    <li>
                                        <b> เทอม: </b> {answer.term}
                                    </li>
                                    <li>
                                        <b> จำนวนข้อ: </b> {answer.total_no}
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
