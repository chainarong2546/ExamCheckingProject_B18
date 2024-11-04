import React from "react";
import ButtonThemeDropdown from "./theme/ButtonThemeDropdown";

type Props = {
    name?: string;
};

export default function AppBar({ name }: Props) {
    return (
        <header className="z-50 h-16 w-full px-6 top-0 left-0 flex justify-between gap-2 items-center shadow-lg bg-blue-600 dark:bg-blue-950">
            <h1 className="text-white text-xl font-medium leading-relaxed flex-grow">
                Exam Checking
            </h1>
            <div className="flex items-center gap-2">
                {name ? <p className="text-lg text-white">{name}</p> : null}
                <ButtonThemeDropdown />
            </div>
        </header>
    );
}
