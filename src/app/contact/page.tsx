"use client";

import { FaArrowLeft, FaGithub, FaEnvelope, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import './styles.css'
import { useI18n } from "../contexts/I18nContext";

export default function ContactPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { t } = useI18n();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        let rafId = 0;
        const handleHoverGlow = (e: MouseEvent) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const cards = document.querySelectorAll<HTMLElement>(".white-hover-effect");
                cards.forEach((card) => {
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty("--mouse-x", `${x}%`);
                    card.style.setProperty("--mouse-y", `${y}%`);
                });
            });
        };

        window.addEventListener("mousemove", handleHoverGlow, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleHoverGlow);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="bg-black text-white flex flex-col min-h-screen relative overflow-x-hidden">
            {/* Cursor light effect */}
            <div
                className="pointer-events-none fixed bg-red-200 opacity-20 blur-[120px] rounded-full w-64 h-64 z-0 transition-all duration-300 ease-out"
                style={{
                    left: `${mousePosition.x - 128}px`,
                    top: `${mousePosition.y - 128}px`,
                }}
            />
            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-16">
                <div className="flex justify-between items-center mb-8 gap-4">
                    <Link href="/">
                        <FaArrowLeft className="text-2xl cursor-pointer transition-transform hover:-translate-x-1 text-white" />
                    </Link>
                    <div className="flex space-x-4 text-sm sm:text-base">
                        <Link href="/projects" className="text-lg hover:text-red-400 transition-colors">
                            {t("nav.projects")}
                        </Link>
                        <Link href="/contact" className="text-lg hover:text-red-400 transition-colors">
                            {t("nav.contact")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-center flex-grow pb-10">
                <div className="w-full max-w-6xl px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
                        <ContactCard
                            icon={<FaGithub className="text-4xl" />}
                            title="TheusHen"
                            subtitle={t("contact.github")}
                            link="https://github.com/TheusHen"
                        />
                        <ContactCard
                            icon={<FaEnvelope className="text-4xl" />}
                            title="dev@theushen.me"
                            subtitle={t("contact.email")}
                            link="mailto:dev@theushen.me"
                        />
                        <ContactCard
                            icon={<FaInstagram className="text-4xl" />}
                            title="@mmatheus_henriquee"
                            subtitle={t("contact.instagram")}
                            link="https://www.instagram.com/mmatheus_henriquee"
                        />
                        <ContactCard
                            icon={<FaLinkedin className="text-4xl" />}
                            title="Matheus Henrique"
                            subtitle={t("contact.linkedin")}
                            link="https://www.linkedin.com/in/matheus-henrique-741776367/"
                        />
                        <YoutubeWideCard
                            link={"https://www.youtube.com/@TheusHen"}
                            title={t("contact.youtubeChannel")}
                            subtitle={t("contact.youtubeSubtitle")}
                            buttonLabel={t("contact.youtubeButton")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon, title, subtitle, link }: { icon: ReactNode; title: string; subtitle: string; link: string }) {
    return (
        <Link href={link} target="_blank" rel="noopener noreferrer" className="white-hover-effect group block h-full rounded-2xl">
            <div className="relative h-full min-h-[260px] sm:min-h-[280px] rounded-2xl border border-gray-600/90 bg-black/60 p-8 sm:p-10 text-center cursor-pointer transition duration-300 group-hover:-translate-y-1 group-hover:border-red-400/60">
                <div className="relative z-10 flex flex-col justify-center items-center h-full">
                    <div className="flex justify-center items-center mb-5">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-600/90 flex justify-center items-center">
                            {icon}
                        </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl mb-2 break-words">{title}</h2>
                    <p className="text-gray-400 text-base sm:text-lg">{subtitle}</p>
                </div>
            </div>
        </Link>
    );
}

function YoutubeWideCard({
    link,
    title,
    subtitle,
    buttonLabel,
}: {
    link: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
}) {
    return (
        <div className="sm:col-span-2 xl:col-span-4 white-hover-effect rounded-2xl">
            <div className="relative border border-gray-600/90 rounded-2xl px-6 py-7 sm:px-8 sm:py-8 w-full bg-black/60">
                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 sm:gap-5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-gray-600/90 flex justify-center items-center shrink-0 bg-red-500/10">
                            <FaYoutube className="text-3xl sm:text-4xl text-red-500" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl">{title}</h2>
                            <p className="text-gray-400 text-base sm:text-lg mt-1">{subtitle}</p>
                            <Link
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-red-300 hover:text-red-200 transition-colors break-all"
                            >
                                {link}
                            </Link>
                        </div>
                    </div>

                    <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/70 bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(239,68,68,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:from-red-500 hover:to-rose-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                    >
                        <FaYoutube className="text-base" />
                        {buttonLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}
