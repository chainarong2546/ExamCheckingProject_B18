import React from "react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    msg: string;
};

export default function ShowError({ msg }: Props) {
    return (
        <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="h-24 m-2 text-red-800" />
            <h2 className="text-5xl">{msg}</h2>
        </div>
    );
}
