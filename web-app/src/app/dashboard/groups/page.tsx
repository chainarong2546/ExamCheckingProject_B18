"use client";
import React, { useEffect, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShowError from "@/components/ShowError";
import Link from "next/link";

type GroupsShowDetail = {
    id: number;
    name: string;
    answers: {
        id: number;
        name: string;
    };
    templates: {
        id: number;
        name: string;
    };
    _count: {
        sheets: number;
    };
    subject: string;
    year: number;
    term: number;
}[];

type Props = object;

export default function Groups_Page({}: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [groups, setGroups] = useState<GroupsShowDetail>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        try {
            const fetchGroups = async () => {
                try {
                    const fetchRes = await fetch("/api/groups", {
                        method: "GET",
                    });
                    const data = await fetchRes.json();
                    if (data.success) {
                        setGroups(data.data);
                        setErrorMsg(null);
                    } else {
                        setGroups([]);
                        setErrorMsg(data.message);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchGroups();
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
            ) : errorMsg ? (
                <ShowError msg={errorMsg} />
            ) : groups.length == 0 ? (
                <p>ไม่มีกลุ่มการตรวจที่สร้างไว้</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {groups.map((group, index) => (
                        <Link key={index} href={`/dashboard/group/${group.id}`}>
                            <div className="min-h-24 p-2 border rounded-md shadow-md border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 hover:brightness-90 dark:hover:hover:brightness-110">
                                <p>
                                    <b>{group.name}</b>
                                </p>
                                <ul className="shadow-sm p-2 m-2 bg-neutral-50 dark:bg-neutral-900">
                                    <li>
                                        <b>วิชา:</b> {group.subject}
                                    </li>
                                    <li>
                                        <b>ปีการศึกษา:</b> {group.year}
                                    </li>
                                    <li>
                                        <b>เทอม:</b> {group.term}
                                    </li>
                                    <li>
                                        <b>ชุดเฉลย:</b> {group.answers.name}
                                    </li>
                                    <li>
                                        <b>แม่แบบฯ:</b> {group.templates.name}
                                    </li>
                                </ul>
                                <p className="text-right">
                                    <b>จำนวน: {group._count.sheets} แผ่น</b>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
