"use client";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/authentified/user/dashboard");
    }
  }, [status, router]);

  const renderSessionContent = () => {
    if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    }

    if (status === "authenticated") {
      return (
        <>
          <span className="text-[#888] text-sm mt-7">Redirection vers le dashboard...</span>
          <button
            className="mt-4 border border-solid border-black rounded px-3 py-1"
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/");
              });
            }}
          >
            Sign Out
          </button>
        </>
      );
    }

    return (
      <Link
        href="/login"
        className="flex justify-center border border-solid w-1/3 text-white bg-indigo-700 border-black rounded-lg"
      >
        <p className="m-2">Sign In</p>
      </Link>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-xl">Home</h1>
      {renderSessionContent()}
    </main>
  );
}
