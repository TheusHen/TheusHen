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

    return (
        <div className="bg-black text-white flex flex-col min-h-screen relative">
            {/* Cursor light effect */}
            <div
                className="pointer-events-none absolute bg-red-200 opacity-20 blur-[120px] rounded-full w-64 h-64 z-0 transition-all duration-300 ease-out"
                style={{
                    left: `${mousePosition.x - 128}px`,
                    top: `${mousePosition.y - 128}px`,
                }}
            />
            <div className="container mx-auto p-4 mt-12">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/">
                        <FaArrowLeft className="text-2xl cursor-pointer transition-transform hover:-translate-x-1 text-white" />
                    </Link>
                    <div className="flex space-x-4">
                        <Link href="/projects" className="text-lg hover:text-red-400 transition-colors">
                            {t("nav.projects")}
                        </Link>
                        <Link href="/contact" className="text-lg hover:text-red-400 transition-colors">
                            {t("nav.contact")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center flex-grow py-6">
                <div className="w-full max-w-[1500px] px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                        <YoutubeWideCard link={"https://www.youtube.com/@TheusHen"} title={t("contact.youtubeChannel")} subtitle={t("contact.youtubeSubtitle")} buttonLabel={t("contact.youtubeButton")} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon, title, subtitle, link }: { icon: ReactNode; title: string; subtitle: string; link: string }) {
    return (
        <Link href={link} target="_blank" rel="noopener noreferrer" className="white-hover-effect">
            <div className="border border-gray-600 rounded-lg p-20 w-80 h-80 text-center cursor-pointer transform transition duration-200 hover:scale-105 flex flex-col justify-center items-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="w-24 h-24 rounded-full border border-gray-600 flex justify-center items-center">
                        {icon}
                    </div>
                </div>
                <h2 className="text-2xl mb-2">{title}</h2>
                <p className="text-gray-400 text-lg">{subtitle}</p>
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
        <div className="md:col-span-4 white-hover-effect">
            <div className="border border-gray-600 rounded-lg px-6 py-7 w-full">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg border border-gray-600 flex justify-center items-center shrink-0">
                            <FaYoutube className="text-3xl text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl">{title}</h2>
                            <p className="text-gray-400 text-lg">{subtitle}</p>
                            <Link href={link} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors break-all">
                                {link}
                            </Link>
                        </div>
                    </div>

                    <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-red-500/60 bg-red-500/10 px-5 py-3 text-base text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
                    >
                        {buttonLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}
