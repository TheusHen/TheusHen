"use client";
import React from "react";

export default function LoadingDots({ color = "#fff", size = 8, className = "" }: { color?: string, size?: number, className?: string }) {
    return (
        <span className={`inline-flex gap-[2px] ${className}`} aria-label="Loading">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: "50%",
                        animation: `loading-bounce 1s infinite both`,
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes loading-bounce {
                    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5;}
                    40% { transform: scale(1); opacity: 1;}
                }
            `}</style>
        </span>
    );
}