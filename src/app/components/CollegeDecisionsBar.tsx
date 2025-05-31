"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CollegeDecisionsBar() {
    return (
        <Link
            href="/decisions"
            className="fixed top-0 left-0 w-full h-10 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white text-lg font-semibold shadow-lg z-[999]"
            style={{ zIndex: 999 }}
        >
            College Decisions
            <ArrowRight className="w-5 h-5" />
        </Link>
    );
}