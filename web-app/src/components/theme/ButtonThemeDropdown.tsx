"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleHalfStroke, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { applyTheme, Theme } from "./ThemeProvider";

export default function ButtonThemeDropdown() {
    const [theme, setTheme] = useState<Theme>("auto");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const savedTheme = (localStorage.getItem("theme") as Theme) || "auto";
        setTheme(savedTheme);
    }, []);

    // Handle theme change
    const handleThemeChange = (selectedTheme: Theme) => {
        setTheme(selectedTheme);
        localStorage.setItem("theme", selectedTheme);
        applyTheme(selectedTheme);
        setDropdownOpen(false);
    };

    return (
        <div className="relative">
            {/* Button to toggle dropdown */}
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-xl text-neutral-50 focus:outline-none"
            >
                {/* Icon based on current theme */}
                {theme === "light" && <FontAwesomeIcon icon={faSun} />}
                {theme === "dark" && <FontAwesomeIcon icon={faMoon} />}
                {theme === "auto" && <FontAwesomeIcon icon={faCircleHalfStroke} />}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
                <ul className="absolute right-0 w-40 shadow-lg z-20 text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900">
                    <li
                        onClick={() => handleThemeChange("light")}
                        className="cursor-pointer flex justify-between px-4 py-2 bg-inherit dark:bg-inherit hover:brightness-90"
                    >
                        <span>โหมดสว่าง</span>
                        {theme === "light" && <FontAwesomeIcon icon={faCheck} />}
                    </li>
                    <li
                        onClick={() => handleThemeChange("dark")}
                        className="cursor-pointer flex justify-between px-4 py-2 bg-inherit dark:bg-inherit hover:brightness-90"
                    >
                        <span>โหมดมืด</span>
                        {theme === "dark" && <FontAwesomeIcon icon={faCheck} />}
                    </li>
                    <li
                        onClick={() => handleThemeChange("auto")}
                        className="cursor-pointer flex justify-between px-4 py-2 bg-inherit dark:bg-inherit hover:brightness-90"
                    >
                        <span>อัตโนมัติ</span>
                        {theme === "auto" && <FontAwesomeIcon icon={faCheck} />}
                    </li>
                </ul>
            )}
        </div>
    );
}
