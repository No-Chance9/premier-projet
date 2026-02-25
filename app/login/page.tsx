"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });
        if (res?.error) {
            setError(res.error as string);
        }
        if (res?.ok) {
            return router.push("/");
        }
    };

    return (
        <div className="flex flex-col max-w-7xl mx-auto h-screen relative">
            <section className="w-full h-1/2 bg-blue-800 flex items-center  justify-center ">
            </section>
            <form
                className="p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] flex flex-col justify-between items-center gap-2
            border border-solid border-black bg-white rounded-lg shadow-lg"
                onSubmit={handleSubmit}>
                {error && <div className="text-black">{error}</div>}
                <h1 className="flex justify-center mb-5 w-full text-2xl font-bold">Login</h1>
                <label className="w-full text-sm">Email</label>
                <input
                    type="email"
                    // placeholder="Email"
                    className="w-full h-8 border bg-slate-200 border-solid border-black rounded p-2"
                    name="email" />
                <label className="w-full text-sm">Password</label>
                <div className="flex w-full">
                    <input
                        type="password"
                        // placeholder="Password"
                        className="w-full h-8 border bg-slate-200 border-solid border-black rounded p-2"
                        name="password" />
                </div>
                <a href="/forgot-password" className="hover:text-blue-600 hover:underline">
                    Mot de passe oublié
                </a>
                <button className="flex justify-center border border-solid w-full text-white bg-blue-800 border-black rounded-lg ">
                    <p className="m-2">Login</p>
                </button>
                <Link
                    href="/register"
                    className="text-sm text-[#888] transition duration-150 ease hover:text-black">
                    Don&apos;t have an account?
                </Link>
            </form>
            <section className="bg-indigo-100 h-1/2">

            </section>
        </div>
    );
};
