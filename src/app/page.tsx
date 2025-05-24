"use client";

import Link from "next/link";
import React, { useState } from "react";
import Particles from "./components/particles";
import { ArrowUp, ArrowDownCircle } from "lucide-react";
import About from "./pages/about";
import './index.css'

// Este site foi inspirado no repositório chronark/chronark.com e utilizou partes e trechos do código do mesmo, partes não somente neste arquivo mas presente em outros

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

    const handleScrollToAboutMe = () => {
        const aboutMeSection = document.getElementById("about-me");
        if (aboutMeSection) {
            aboutMeSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <div
                className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black relative"
                style={{ backgroundImage: "linear-gradient(to top left, black, rgba(82, 82, 82, 0.2), black)" }}
            >
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

                <div className="absolute bottom-12 flex flex-col items-center animate-bounce cursor-pointer z-20" onClick={handleScrollToAboutMe}>
                    <ArrowDownCircle size={40} className="text-zinc-400 hover:text-zinc-200 transition-all duration-300" />
                    <span className="mt-2 text-zinc-400 text-sm sm:text-base font-medium">
                        Scroll down to see more <span className="font-bold">About Me</span>
                    </span>
                </div>
            </div>

            <div id="about-me" className="w-screen min-h-screen flex justify-center items-center relative z-10">
                <Particles
                    className="absolute inset-0 -z-10 animate-fade-in"
                    quantity={100}
                />
                <About />
            </div>
        </>
    );
}