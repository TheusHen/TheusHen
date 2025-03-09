"use client";

import Link from "next/link";
import React, { useState } from "react";
import Particles from "./components/particles";
import { ArrowUp } from "lucide-react";
import "./globals.css"

const navigation = [
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
];

export default function Home() {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            const encodedMessage = encodeURIComponent(message);
            window.location.href = `https://intouchbot.theushen.me?help=${encodedMessage}`;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black relative">
            <nav className="mt-12 animate-fade-in">
                <ul className="flex items-center justify-center gap-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
                        >
                            {item.name}
                        </Link>
                    ))}
                </ul>
            </nav>
            <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 mt-4" />
            <Particles
                className="absolute inset-0 -z-10 animate-fade-in"
                quantity={100}
            />
            <h1 className="py-2 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
                TheusHen
            </h1>
            <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 mt-4" />
            <div className="flex items-center bg-white rounded-full p-2 shadow-md w-full max-w-md mt-8 sm:max-w-xs">
                <input
                    type="text"
                    placeholder="Need some help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-600 px-3 text-sm sm:text-xs"
                />
                <button
                    onClick={handleSend}
                    className="bg-black text-white p-2 rounded-full flex items-center justify-center"
                >
                    <ArrowUp size={20} />
                </button>
            </div>
        </div>
    );
}
