"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Props = object;

export default function Login_Page({}: Props) {
    const router = useRouter();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (trimmedUsername === "") {
            setErrorMsg("ชื่อผู้ใช้ว่างเปล่า");
            setLoading(false);
            return;
        }
        if (trimmedPassword === "") {
            setErrorMsg("รหัสผ่านว่างเปล่า");
            setLoading(false);
            return;
        }

        // Attempt to sign in with credentials
        const result = await signIn("credentials", {
            redirect: false,
            username: trimmedUsername,
            password: trimmedPassword,
        });
        if (!result?.ok) {
            setLoading(false);
            setErrorMsg(result?.error || "");
        } else {
            Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                router.push("/dashboard");
            });
        }
    };
    return (
        <div className="flex flex-col pt-32 items-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 rounded-lg shadow-xl bg-neutral-50 dark:bg-neutral-800">
                <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-200">
                    เข้าสู่ระบบ
                </h2>
                {errorMsg && <div className="text-red-500 mb-4">{errorMsg}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-neutral-900 dark:text-neutral-200"
                        >
                            ชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full mt-1 px-3 py-2 border text-black border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-neutral-900 dark:text-neutral-200"
                        >
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full mt-1 px-3 py-2 border text-black border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full font-bold py-2 px-4 rounded bg-blue-500 dark:bg-blue-400 text-neutral-100 dark:text-neutral-900 ${
                            loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-90"
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                />
                                กำลังเข้าสู่ระบบ
                            </div>
                        ) : (
                            "เข้าสู่ระบบ"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
