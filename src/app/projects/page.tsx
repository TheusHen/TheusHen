"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Filter, Star, ExternalLink, X } from "lucide-react";
import Image from "next/image";

// --- ScrollArea Component ---
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import './styles.css'

import { cn } from "@/app/lib/cn";

// --- ScrollArea definition ---
const ScrollArea = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
    >
        <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
            {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
            "flex touch-none select-none transition-colors",
            orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent p-[1px]",
            orientation === "horizontal" &&
            "h-2.5 flex-col border-t border-t-transparent p-[1px]",
            className
        )}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

// --- Main ProjectsPage Component ---

const fallbackImg = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
const GITHUB_USERNAME = "TheusHen";

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    owner: { avatar_url: string };
    fork: boolean;
    homepage?: string | null;
    topics?: string[];
}

const ProjectsPage = () => {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    // Featured projects filters
    const [openSource, setOpenSource] = useState(true);
    const [closeSource, setCloseSource] = useState(true);
    const [website, setWebsite] = useState(true);
    const [application, setApplication] = useState(true);

    // GitHub projects filter
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [allTopics, setAllTopics] = useState<string[]>([]);

    // New: Topics navigation state
    const [topicsPage, setTopicsPage] = useState(0);
    const TOPICS_PER_PAGE = 10;

    const gridRef = useRef<HTMLDivElement>(null);

    // Track mouse position for red hover effect and light effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Update CSS custom properties for mouse position
    useEffect(() => {
        const updateMousePosition = (element: HTMLElement, clientX: number, clientY: number) => {
            const rect = element.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * 100;
            const y = ((clientY - rect.top) / rect.height) * 100;
            element.style.setProperty('--mouse-x', `${x}%`);
            element.style.setProperty('--mouse-y', `${y}%`);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const hoverElements = document.querySelectorAll('.white-hover-effect');
            hoverElements.forEach((element) => {
                updateMousePosition(element as HTMLElement, e.clientX, e.clientY);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setRepos(data);

                    // Extract all unique topics
                    const topics = new Set<string>();
                    data.forEach((repo: Repo) => {
                        if (repo.topics && repo.topics.length > 0) {
                            repo.topics.forEach(topic => topics.add(topic));
                        }
                    });
                    setAllTopics(Array.from(topics).sort());

                    setError(null);
                } else {
                    setError("Error fetching repositories.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching repositories.");
                setLoading(false);
            });
    }, []);

    const toggleFilterMenu = () => {
        setShowFilterMenu((prev) => !prev);
    };

    const applyFilters = () => {
        toggleFilterMenu();
    };

    const clearAllFilters = () => {
        setOpenSource(true);
        setCloseSource(true);
        setWebsite(true);
        setApplication(true);
        setSelectedTopics([]);
        setTopicsPage(0);
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    // Static cards filters - only affect featured
    const showMitpa = openSource && website;
    const showArcadeLunar = closeSource && application;
    const showOptifyx = openSource && application;

    // Filter GitHub repos (only by topics now)
    const filteredRepos = repos.filter((repo) => {
        // Filter by topics if any are selected
        if (selectedTopics.length === 0) return true;
        return repo.topics && selectedTopics.some(topic => repo.topics?.includes(topic));
    });

    const sortedRepos = [...filteredRepos].sort((a, b) =>
        b.stargazers_count !== a.stargazers_count
            ? b.stargazers_count - a.stargazers_count
            : a.name.localeCompare(b.name)
    );

    // --- Topics pagination logic ---
    const totalTopicsPages = Math.ceil(allTopics.length / TOPICS_PER_PAGE);
    const pagedTopics = allTopics.slice(
        topicsPage * TOPICS_PER_PAGE,
        (topicsPage + 1) * TOPICS_PER_PAGE
    );

    const goPrevTopics = () => setTopicsPage((prev) => Math.max(0, prev - 1));
    const goNextTopics = () => setTopicsPage((prev) => Math.min(totalTopicsPages - 1, prev + 1));

    useEffect(() => {
        // If user clears all topics or new topics list changes, reset navigation if out of bounds
        if (topicsPage > totalTopicsPages - 1) setTopicsPage(0);
    }, [allTopics.length, topicsPage, totalTopicsPages]);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
            {/* Cursor light effect */}
            <div
                className="pointer-events-none absolute bg-red-200 opacity-20 blur-[120px] rounded-full w-64 h-64 z-0 transition-all duration-300 ease-out"
                style={{
                    left: `${mousePosition.x - 128}px`,
                    top: `${mousePosition.y - 128}px`,
                }}
            />
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 animate-fade-in">
                    <button className="text-2xl cursor-pointer transition-transform hover:-translate-x-1 text-white" onClick={() => window.location.href = '/'}>
                        <ArrowLeft />
                    </button>
                    <div className="flex space-x-6">
                        <button className="text-lg hover:text-red-400 transition-colors" onClick={() => window.location.href = '/projects'}>
                            Projects
                        </button>
                        <button className="text-lg hover:text-red-400 transition-colors" onClick={() => window.location.href = '/contact'}>
                            Contact
                        </button>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-extrabold text-white mb-2 animate-fade-in">
                    Projects
                </h1>
                <p className="text-xl text-gray-400 mb-6 animate-fade-in">
                    Some of the projects are from work and some are on my own time.
                </p>

                {/* Filters */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                    <span className="text-lg text-gray-300">All Projects</span>
                    <div
                        className="flex items-center space-x-2 cursor-pointer transition-colors hover:text-red-400"
                        onClick={toggleFilterMenu}
                    >
                        <Filter size={16} />
                        <span>Filters</span>
                    </div>
                </div>

                {/* Filter Menu */}
                {showFilterMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            onClick={toggleFilterMenu}
                        />

                        {/* Filter Modal */}
                        <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fade-in max-w-lg w-full mx-4">
                            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                    <h3 className="text-xl font-semibold text-white">Filters</h3>
                                    <button
                                        onClick={toggleFilterMenu}
                                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Featured Project Types */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Featured Project Type</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={openSource}
                                                    onChange={(e) => setOpenSource(e.target.checked)}
                                                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-300">Open Source</span>
                                            </label>
                                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={closeSource}
                                                    onChange={(e) => setCloseSource(e.target.checked)}
                                                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-300">Close Source</span>
                                            </label>
                                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={website}
                                                    onChange={(e) => setWebsite(e.target.checked)}
                                                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-300">Website</span>
                                            </label>
                                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={application}
                                                    onChange={(e) => setApplication(e.target.checked)}
                                                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-300">Application</span>
                                            </label>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            <span>* Filters above affect only the featured projects.</span>
                                        </div>
                                    </div>

                                    {/* Topics Filter (for GitHub projects) */}
                                    {allTopics.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-medium text-gray-300">Topics</h4>
                                                {selectedTopics.length > 0 && (
                                                    <button
                                                        onClick={() => setSelectedTopics([])}
                                                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        Clear ({selectedTopics.length})
                                                    </button>
                                                )}
                                            </div>
                                            {/* Topics Navigation Controls */}
                                            <div className="flex items-center mb-2">
                                                <button
                                                    className="mr-2 p-1 rounded hover:bg-gray-700 disabled:opacity-40"
                                                    onClick={goPrevTopics}
                                                    disabled={topicsPage === 0}
                                                    aria-label="Previous topics page"
                                                    type="button"
                                                >
                                                    <ArrowLeft size={18} />
                                                </button>
                                                <span className="text-xs text-gray-400">{topicsPage + 1} / {totalTopicsPages}</span>
                                                <button
                                                    className="ml-2 p-1 rounded hover:bg-gray-700 disabled:opacity-40"
                                                    onClick={goNextTopics}
                                                    disabled={topicsPage >= totalTopicsPages - 1}
                                                    aria-label="Next topics page"
                                                    type="button"
                                                >
                                                    <ArrowRight size={18} />
                                                </button>
                                            </div>
                                            <ScrollArea className="rounded-lg border border-gray-700 bg-gray-800/50 max-h-48">
                                                <div className="p-3 flex flex-wrap gap-2">
                                                    {pagedTopics.map((topic) => (
                                                        <button
                                                            key={topic}
                                                            className={cn(
                                                                "px-3 py-1 rounded-full text-xs font-medium transition-colors border border-gray-700",
                                                                selectedTopics.includes(topic)
                                                                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-transparent shadow-lg scale-105"
                                                                    : "bg-gray-900 text-gray-300 hover:bg-gray-700/70 hover:text-red-300"
                                                            )}
                                                            onClick={() => toggleTopic(topic)}
                                                            type="button"
                                                        >
                                                            {topic}
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between p-6 border-t border-gray-700">
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        Clear All
                                    </button>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={toggleFilterMenu}
                                            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                                            onClick={applyFilters}
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Featured Projects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* MITPA Project */}
                    {showMitpa && (
                        <div className="white-spin-border white-hover-effect">
                            <div className="white-spin-border-content p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Image
                                        src="https://mitpa-tech.vercel.app/Logo.png"
                                        alt="MITPA Project"
                                        width={248}
                                        height={96}
                                        className="w-62 h-24  rounded-xl"
                                        priority
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">MITPA</h2>
                                <p className="text-gray-300 text-sm mb-4">
                                    MITPA is an open-source community focused on helping students
                                    prepare for admission to the Massachusetts Institute of Technology
                                    (MIT). It provides a platform for students worldwide to discuss
                                    study strategies, share experiences, and connect with like-minded
                                    individuals.
                                </p>
                                <a
                                    className="text-sm flex items-center space-x-1 hover:underline cursor-pointer text-red-400 hover:text-red-300 transition-colors"
                                    href="https://mitpa.tech"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>Read more</span>
                                    <ArrowRight size={14} />
                                </a>
                            </div>
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
                                className="white-spin-border white-hover-effect"
                            >
                                <div className="white-spin-border-content p-6">
                                    <Image
                                        src="https://avatars.githubusercontent.com/u/174283552"
                                        alt="Arcade Lunar"
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 rounded-xl mb-4"
                                    />
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Arcade Lunar
                                    </h2>
                                    <p className="text-gray-300 text-sm">
                                        Arcade Lunar is a social network focused on gaming and
                                        multiplayer experiences. It connects players worldwide,
                                        offering communities, events, and interactive features.
                                    </p>
                                </div>
                            </a>
                        )}

                        {/* Optifyx */}
                        {showOptifyx && (
                            <a
                                href="https://optifyx.live"
                                target="_blank"
                                rel="noreferrer"
                                className="white-spin-border white-hover-effect"
                            >
                                <div className="white-spin-border-content p-6">
                                    <Image
                                        src="/optifyx.png"
                                        alt="Optifyx"
                                        width={144}
                                        height={88}
                                        className="w-36 h-22 rounded-xl mb-4"
                                    />
                                    <h2 className="text-2xl font-bold text-white mb-2">Optifyx</h2>
                                    <p className="text-gray-300 text-sm">
                                        Optifyx is an app that allows a smartphone to fully monitor a
                                        desktop in real-time over a Wi-Fi connection. It provides
                                        seamless remote access, ensuring control and visibility.
                                    </p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>

                {/* GitHub Projects */}
                <h2 className="text-3xl font-extrabold mt-10 mb-6 text-white">
                    GitHub Projects
                </h2>
                {loading ? (
                    <div className="text-gray-400">Loading repositories…</div>
                ) : error ? (
                    <div className="text-red-400">{error}</div>
                ) : (
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {sortedRepos.map((repo) => (
                            <div
                                key={repo.id}
                                className="transition-transform hover:scale-105 white-hover-effect"
                                style={{ border: "none" }}
                            >
                                <div className="p-5 h-full flex flex-col bg-transparent border-none">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Image
                                            src={repo.owner.avatar_url || fallbackImg}
                                            alt={repo.name}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = fallbackImg;
                                            }}
                                        />
                                        <span className="text-lg font-semibold truncate text-white">
                                            {repo.name}
                                        </span>
                                        {repo.homepage && (
                                            <a
                                                href={repo.homepage}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                                                title="Project Website"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="flex-1 text-gray-300 text-sm mb-4">
                                        {repo.description || <span className="italic text-gray-500">No description</span>}
                                    </p>

                                    {/* Topics */}
                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {repo.topics.slice(0, 3).map((topic) => (
                                                <span
                                                    key={topic}
                                                    className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-600"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                            {repo.topics.length > 3 && (
                                                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                                                    +{repo.topics.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end mt-auto">
                                        <span className="text-xs px-2 py-1 rounded bg-red-600 text-white">
                                            {repo.language ?? "Other"}
                                        </span>
                                        <span className="flex items-center text-xs text-red-400 font-bold">
                                            <Star className="mr-1" size={12} /> {repo.stargazers_count}
                                        </span>
                                    </div>
                                    {/* Overlay link to make the whole card clickable, but avoid nested <a> */}
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="absolute inset-0"
                                        aria-label={`View ${repo.name} on GitHub`}
                                        style={{ zIndex: 10 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;