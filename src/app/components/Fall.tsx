import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Fall() {
    return (
        <div
            style={{
                width: 380,
                height: 240,
                background: "transparent",
                overflow: "hidden",
                position: "relative",
                touchAction: "none",
                fontFamily: "system-ui,Roboto,sans-serif",
                margin: "40px auto",
                borderRadius: 16,
                boxShadow: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Remove flexDirection, let inner wrapper handle content direction
            }}
        >
            {/* Center absolutely everything inside the container */}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    // Remove any margin or gap here to ensure full centralization
                }}
            >
                {/* Centralized Buttons */}
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 36,
                        width: "100%",
                    }}
                >
                    <Link href="/projects" legacyBehavior>
                        <a className="custom-btn projects-btn">
                            Projects
                        </a>
                    </Link>
                    <Link href="/contact" legacyBehavior>
                        <a className="custom-btn contact-btn">
                            Contact
                        </a>
                    </Link>
                </div>
                {/* Centralized LICENSE and source code message */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 0.25, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                        color: "#fff",
                        fontSize: 13,
                        textAlign: "center",
                        zIndex: 2,
                        pointerEvents: "none",
                        textShadow: "0 0 5px #000a, 0 0 1px #fff",
                        letterSpacing: 1,
                        width: "100%", // Ensures text stays centered even if it wraps
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    LICENSE and source code available.
                </motion.div>
            </div>
            <style jsx>{`
                .custom-btn {
                    position: relative;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    padding: 7px 22px;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    transition: color 0.2s, box-shadow 0.2s, transform 0.18s;
                    overflow: hidden;
                    z-index: 1;
                    box-shadow: 0 2px 12px #0008, 0 0 0 transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .custom-btn:before {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) scale(0.7);
                    width: 110%;
                    height: 120%;
                    background: rgba(255, 0, 0, 0.23);
                    border-radius: 16px;
                    opacity: 0;
                    z-index: -1;
                    transition: opacity 0.18s, transform 0.18s;
                }

                .custom-btn:hover,
                .custom-btn:focus-visible {
                    color: #fff;
                    transform: translateY(-2px) scale(1.04);
                    box-shadow: 0 4px 20px #ff313180, 0 2px 10px #0008;
                }

                .custom-btn:hover:before,
                .custom-btn:focus-visible:before {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                    background: rgba(255, 20, 20, 0.35);
                }

                .custom-btn:active {
                    transform: scale(0.95);
                }
            `}</style>
        </div>
    );
}