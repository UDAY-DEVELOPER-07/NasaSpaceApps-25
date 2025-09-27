"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Loader() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Dashboard"); 
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="text-center animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide">
          AETHER
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mt-2">
          The Leo Experience
        </p>
        <div className="mt-6">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
