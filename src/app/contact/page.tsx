import { FaArrowLeft, FaGithub, FaEnvelope, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { ReactNode } from "react";
import "../globals.css"

export default function ContactPage() {
    return (
        <div className="bg-black text-white flex flex-col min-h-screen">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/">
                        <FaArrowLeft className="text-xl" />
                    </Link>
                    <div className="flex space-x-4">
                        <Link href="/projects" className="text-gray-400">
                            Projects
                        </Link>
                        <Link href="/contact" className="text-gray-400">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ContactCard
                        icon={<FaGithub className="text-4xl" />}
                        title="TheusHen"
                        subtitle="Github"
                        link="https://github.com/TheusHen"
                    />
                    <ContactCard
                        icon={<FaEnvelope className="text-4xl" />}
                        title="dev@theushen.me"
                        subtitle="Email"
                        link="mailto:dev@theushen.me"
                    />
                    <ContactCard
                        icon={<FaInstagram className="text-4xl" />}
                        title="@mmatheus_henriquee"
                        subtitle="Instagram"
                        link="https://www.instagram.com/mmatheus_henriquee"
                    />
                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon, title, subtitle, link }: { icon: ReactNode; title: string; subtitle: string; link: string }) {
    return (
        <Link href={link} target="_blank" rel="noopener noreferrer">
            <div className="border border-gray-600 rounded-lg p-12 text-center cursor-pointer transform transition duration-200 hover:scale-105">
                <div className="flex justify-center items-center mb-4">
                    <div className="w-16 h-16 rounded-full border border-gray-600 flex justify-center items-center">
                        {icon}
                    </div>
                </div>
                <h2 className="text-xl mb-2">{title}</h2>
                <p className="text-gray-400">{subtitle}</p>
            </div>
        </Link>
    );
}
