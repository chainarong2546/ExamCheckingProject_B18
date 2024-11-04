"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export type DrawerMenu = {
    icon: React.ReactNode;
    title: string;
    url: string;
};

type Props = {
    mainMenu: DrawerMenu[];
    bottomMenu: DrawerMenu[];
};

export default function Drawer({ mainMenu, bottomMenu }: Props) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div
            className={`${
                isCollapsed ? "w-0 sm:w-16" : "w-60"
            } fixed top-0 pt-16 sm:pt-0 sm:relative transition-[width] h-full z-30 duration-300 flex flex-col border-r border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-black dark:text-white`}
        >
            {/* ปุ่มยุบ-ขยาย Drawer */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute left-full transform top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 px-1 py-8 rounded-full bg-inherit border-inherit box-border border text-inherit hover:brightness-75"
            >
                {isCollapsed ? (
                    <FontAwesomeIcon icon={faAnglesRight} />
                ) : (
                    <FontAwesomeIcon icon={faAnglesLeft} />
                )}
            </button>

            {/* ส่วนที่เป็นรายการแบบเลื่อนขึ้นลง mainMenu*/}
            <div className="flex-grow overflow-y-auto overflow-x-hidden py-2">
                <ul>
                    {Array.isArray(mainMenu) &&
                        mainMenu.map((menu, index) => (
                            <li key={index}>
                                <Link href={menu.url}>
                                    <button className="w-full flex items-center px-4 py-2 h-12 bg-gray-50 dark:bg-gray-950 hover:brightness-90 dark:hover:brightness-200">
                                        <span className="w-8">{menu.icon}</span>
                                        <p
                                            className={`${
                                                isCollapsed ? "hidden" : ""
                                            } flex-grow text-left ms-6 whitespace-nowrap`}
                                        >
                                            {menu.title}
                                        </p>
                                    </button>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>

            {/* ปุ่มคงที่ที่ด้านล่าง */}
            <div className="h-fit overflow-hidden py-2 border-t border-gray-300">
                <ul>
                    {bottomMenu &&
                        bottomMenu.map((menu, index) => (
                            <li key={index}>
                                <Link href={menu.url}>
                                    <button className="w-full flex items-center px-4 py-2 h-12 bg-gray-50 dark:bg-gray-950 hover:brightness-90 dark:hover:brightness-200">
                                        <span className="w-8">{menu.icon}</span>
                                        <p
                                            className={`${
                                                isCollapsed ? "hidden" : ""
                                            } flex-grow text-left ms-6 whitespace-nowrap`}
                                        >
                                            {menu.title}
                                        </p>
                                    </button>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
