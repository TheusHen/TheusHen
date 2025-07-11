"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Fall from "../components/Fall";
import GlobeBrazil from "../components/Globe";
import TechCarousel from "../components/TechCarousel";

const PROFILE_IMAGE = "https://avatars.githubusercontent.com/u/180109164";
const HACKCLUB_IMAGE =
    "https://images.fillout.com/orgid-81/flowpublicid-eLhFehpKG6us/widgetid-cbsLd1W9tHmPW9frkYFap2/3G6y1B7Rk3agk6YVqtLmJN/Group-106.png?a=hcRnPh87k73TcrVHzBe6UW";
const COLLEGE_APP_DATE = new Date("2027-11-01T00:00:00Z");

function getTimeLeft() {
    // This function should only be called on the client
    if (typeof window === "undefined") {
        // Avoids hydration mismatch: always return the same for SSR
        return { days: 0, hours: 0, mins: 0, secs: 0 };
    }
    const target = COLLEGE_APP_DATE.getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return { days, hours, mins, secs };
}

function ProfileImage() {
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (imgRef.current)
            gsap.fromTo(
                imgRef.current,
                { y: -100, opacity: 0, rotate: -10 },
                { y: 0, opacity: 1, rotate: 0, duration: 1.2, delay: 0.5, ease: "elastic.out(1,0.75)" }
            );
    }, []);

    return (
        <div
            ref={imgRef}
            className="flex items-center justify-center md:justify-end md:items-center p-8 bg-transparent relative "
        >
            <Image
                src={PROFILE_IMAGE}
                alt="Profile photo"
                width={160}
                height={160}
                className="w-40 h-40 rounded-full shadow-xl border-4 border-red-500 object-cover hover:scale-110 transition-transform duration-300"
                priority
            />
            <div className="absolute bottom-4 right-4 w-20 h-14 rounded shadow-lg" style={{ zIndex: 10 }}>
                <Image
                    src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                    alt="Brazil Flag"
                    width={80}
                    height={56}
                    className="w-20 h-14 rounded shadow-lg"
                />
            </div>
        </div>
    );
}

function TextSection() {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current)
            gsap.fromTo(
                textRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" }
            );
    }, []);

    return (
        <div
            ref={textRef}
            className="flex-1 p-8 flex flex-col gap-2 justify-center"
        >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                Hello, I&apos;m <span className="text-red-800">TheusHen</span>!
            </h1>
            <div className="flex flex-col gap-3 text-lg md:text-xl text-white/90 mb-2 leading-relaxed">
                <span>
                    14-year-old student dreaming big and building the future with code. I&apos;m determined to get into <span className="font-bold text-red-600">MIT</span> with a full-ride scholarship, where I plan to major in Aerospace Engineering and Computer Engineering.
                </span>
                <span>
                    Founder of <span className="font-bold text-red-600">PRACTA</span>, an open source community that helps students achieve their academic and personal goals with lots of code, collaboration, and resilience.
                </span>
                <span>
                    I&apos;ve already developed projects such as viral mutation simulators, digital organizers, and remote diagnosis systems, and I actively participate in hackathons like <span className="text-red-600 font-bold">Shipwrecked</span> and events from <span className="text-red-600 font-bold">Hack Club</span>.
                </span>
                <span>
                    I&apos;m always looking to learn new technologies, contribute to open source repositories, and grow as a developer and as a person.
                </span>
                <span>
                    If you want to chat about programming, science, communities, or how to turn dreams into projects, reach out to me!
                </span>
            </div>
            <div className="flex gap-4 mt-4">
                <a
                    href="https://github.com/TheusHen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md scale-90 hover:scale-105"
                >
                    GitHub
                </a>
                <a
                    href="https://www.linkedin.com/in/matheus-henrique-741776367/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md scale-90 hover:scale-105"
                >
                    LinkedIn
                </a>
            </div>
            <div className="flex justify-center mt-8">
                <img
                    src="https://raw.githubusercontent.com/TheusHen/TheusHen/output/snake.svg"
                    alt="GitHub Contribution Snake"
                    className="max-w-full h-auto"
                />
            </div>
        </div>
    );
}

function HackClubSection() {
    const hackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hackRef.current)
            gsap.fromTo(
                hackRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: "power2.out" }
            );
    }, []);

    return (
        <div
            ref={hackRef}
            className="flex items-center gap-6 bg-zinc-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-red-400/20 hidden sm:flex"
        >
            <Image
                src={HACKCLUB_IMAGE}
                alt="Hack Club"
                width={272}
                height={112}
                className="w-68 h-28 rounded-lg drop-shadow-lg hover:rotate-6 transition-transform duration-300"
            />
            <div>
                <span className="text-2xl font-bold text-red-300">Hack Club</span>
                <p className="text-white/80 text-base mt-1">I&apos;m currently participating in!</p>
            </div>
        </div>
    );
}

function TimerSection() {
    const [timer, setTimer] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const timerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimer(getTimeLeft());
        const interval = setInterval(() => setTimer(getTimeLeft()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timerRef.current)
            gsap.fromTo(
                timerRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, delay: 2, ease: "power2.out" }
            );
    }, []);

    return (
        <div
            ref={timerRef}
            className="flex flex-col h-40 items-center justify-center bg-zinc-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-red-400/20"
        >
            <span className="text-lg font-semibold text-red-300 mb-2">Time left until my College Application</span>
            <div className="flex gap-3 text-white text-2xl font-mono tracking-wider">
                <div className="flex flex-col items-center">
                    <span>{timer.days}</span>
                    <span className="text-xs text-red-400">days</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{timer.hours}</span>
                    <span className="text-xs text-red-400">h</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{timer.mins}</span>
                    <span className="text-xs text-red-400">min</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{timer.secs}</span>
                    <span className="text-xs text-red-400">s</span>
                </div>
            </div>
        </div>
    );
}

export default function About() {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current)
            gsap.fromTo(
                cardRef.current,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.1, delay: 1, ease: "back.out(1.7)" }
            );
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-bl from-black/40 via-zinc-600/20 to-red-900 flex flex-col items-center justify-center p-6 transition-colors duration-1000">
            <div
                ref={cardRef}
                className="w-full max-w-4xl mt-20 bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row items-center md:items-stretch overflow-hidden border border-white/10"
            >
                <TextSection />
                <ProfileImage />
            </div>
            <div className="flex flex-col gap-8 items-center mt-12 sm:flex-row">
                <HackClubSection />
                <TimerSection />
            </div>
            <GlobeBrazil />
            <Fall />
            <TechCarousel />
        </div>
    );
}
