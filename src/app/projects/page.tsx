"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaFilter } from "react-icons/fa";
import mitpaLogo from "../../assets/mitpa.png";
import optifyxLogo from "../../assets/optifyx.png";

export default function ProjectsPage() {
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Filter states
    const [openSource, setOpenSource] = useState(true);
    const [closeSource, setCloseSource] = useState(true);
    const [website, setWebsite] = useState(true);
    const [application, setApplication] = useState(true);

    const toggleFilterMenu = () => {
        setShowFilterMenu((prev) => !prev);
    };

    const applyFilters = () => {
        toggleFilterMenu();
    };

    // Determine visibility of each project
    const showMitpa = openSource && website;
    const showArcadeLunar = closeSource && application;
    const showOptifyx = openSource && application;

    return (
        <div className="bg-black text-white font-sans min-h-screen">

            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/">
                        <FaArrowLeft className="text-2xl cursor-pointer" />
                    </Link>
                    <div className="flex space-x-6">
                        <Link href="/projects" className="text-lg hover:underline">
                            Projects
                        </Link>
                        <Link href="/contact" className="text-lg hover:underline">
                            Contact
                        </Link>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-bold">Projects</h1>
                <p className="text-xl text-gray-400 mt-2 mb-6">
                    Some of the projects are from work and some are on my own time.
                </p>

                {/* Filters */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                    <span className="text-lg">All Projects</span>
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={toggleFilterMenu}
                    >
                        <FaFilter />
                        <span>Filters</span>
                    </div>
                </div>

                {/* Filter Menu */}
                {showFilterMenu && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 absolute">
                        <label className="block">
                            <input
                                type="checkbox"
                                id="open-source"
                                checked={openSource}
                                onChange={(e) => setOpenSource(e.target.checked)}
                            />{" "}
                            Open Source
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                id="close-source"
                                checked={closeSource}
                                onChange={(e) => setCloseSource(e.target.checked)}
                            />{" "}
                            Close Source
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                id="website"
                                checked={website}
                                onChange={(e) => setWebsite(e.target.checked)}
                            />{" "}
                            Website
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                id="application"
                                checked={application}
                                onChange={(e) => setApplication(e.target.checked)}
                            />{" "}
                            Application
                        </label>
                        <button
                            className="mt-2 bg-red-500 px-4 py-2 rounded"
                            onClick={applyFilters}
                        >
                            Apply
                        </button>
                    </div>
                )}

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MITPA Project */}
                    {showMitpa && (
                        <div
                            id="mitpa"
                            className="md:col-span-1 bg-gray-0 p-6 rounded-xl border border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <img src={mitpaLogo.src} alt="MITPA Logo" className="h-24" />
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                                MITPA is an open-source community focused on helping students
                                prepare for admission to the Massachusetts Institute of Technology
                                (MIT). It provides a platform for students worldwide to discuss
                                study strategies, share experiences, and connect with like-minded
                                individuals. The primary language of the community is English, and
                                it aims to foster collaboration, knowledge exchange, and academic
                                growth.
                            </p>
                            <a
                                className="text-sm text-white flex items-center space-x-1 hover:underline cursor-pointer"
                                href="https://mitpa.tech"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>Read more</span>
                                <FaArrowRight />
                            </a>
                        </div>
                    )}

                    {/* Other Projects */}
                    <div className="flex flex-col space-y-6">
                        {/* Arcade Lunar */}
                        {showArcadeLunar && (
                            <a
                                href="https://arcadelunar.com.br"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div
                                    id="arcade-lunar"
                                    className="bg-gray-0 p-6 rounded-xl border border-gray-700"
                                >
                                    <h2 className="text-2xl font-bold">Arcade Lunar</h2>
                                    <p className="text-gray-300 text-sm mt-2">
                                        Arcade Lunar is a social network focused on gaming and
                                        multiplayer experiences. It connects players worldwide,
                                        offering communities, events, and interactive features to
                                        enhance the gaming experience.
                                    </p>
                                </div>
                            </a>
                        )}

                        {/* Optifyx */}
                        {showOptifyx && (
                            <a href="https://optifyx.live" target="_blank" rel="noreferrer">
                                <div
                                    id="optifyx"
                                    className="bg-gray-0 p-6 rounded-xl border border-gray-700"
                                >
                                    <img src={optifyxLogo.src} alt="Optifyx Logo" className="h-24 mb-2" />
                                    <p className="text-gray-300 text-sm mt-2">
                                        Optifyx is an app that allows a smartphone to fully monitor a
                                        desktop in real-time over a Wi-Fi connection. It provides
                                        seamless remote access, ensuring control and visibility
                                        anytime.
                                    </p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
