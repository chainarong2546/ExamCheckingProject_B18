import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import {
    faHouse,
    faFolder,
    faTable,
    faUsers,
    faFileAlt,
    faUserCircle,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppBar from "@/components/AppBar";
import Drawer, { DrawerMenu } from "@/components/Drawer";
import { redirect } from "next/navigation";

const mainMenu: DrawerMenu[] = [
    {
        icon: <FontAwesomeIcon icon={faHouse} />,
        title: "แดชบอร์ด",
        url: "/dashboard",
    },
];

const teacherMenu: DrawerMenu[] = [
    {
        icon: <FontAwesomeIcon icon={faFileAlt} />,
        title: "ชุดเฉลย",
        url: "/dashboard/answers",
    },
    {
        icon: <FontAwesomeIcon icon={faFolder} />,
        title: "กลุ่มการตรวจ",
        url: "/dashboard/groups",
    },
    {
        icon: <FontAwesomeIcon icon={faTable} />,
        title: "แม่แบบกระดาษคำตอบ",
        url: "/dashboard/templates",
    },
];

const adminMenu: DrawerMenu[] = [
    {
        icon: <FontAwesomeIcon icon={faUsers} />,
        title: "ผู้ใช้",
        url: "/dashboard/users",
    },
    {
        icon: <FontAwesomeIcon icon={faTable} />,
        title: "แม่แบบกระดาษคำตอบ",
        url: "/dashboard/templates",
    },
];

const bottomMenu: DrawerMenu[] = [
    {
        icon: <FontAwesomeIcon icon={faUserCircle} />,
        title: "โปรไฟล์",
        url: "/dashboard/profile",
    },
    {
        icon: <FontAwesomeIcon icon={faRightFromBracket} />,
        title: "ออกจากระบบ",
        url: "/logout",
    },
];

type Props = {
    children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
    const session = await getServerSession(authOptions);
    let showMenu = [...mainMenu];

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role_id === 1) { // admin
        showMenu = [...mainMenu, ...adminMenu];
    }
    if (session.user.role_id === 2) { // user
        showMenu = [...mainMenu, ...teacherMenu];
    }

    return (
        <div className="h-screen flex flex-col">
            <AppBar name={session.user.username || ""} />
            <div className="flex flex-1 overflow-hidden">
                <Drawer mainMenu={showMenu} bottomMenu={bottomMenu} />

                {/* เนื้อหา */}
                <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-950">
                    <div className="w-full h-full overflow-auto p-3 border rounded-2xl shadow-2xl border-gray-200 dark:border-gray-950 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
