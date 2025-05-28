import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AnimatedEquationFall() {
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
                boxShadow: "0 2px 18px #0002",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
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
                }}
            >
                <Link href="/contact" legacyBehavior>
                    <a
                        style={{
                            background: "#ff3131",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 15,
                            padding: "7px 22px",
                            fontWeight: 500,
                            cursor: "pointer",
                            boxShadow: "0 1px 6px #ff31312a",
                            textDecoration: "none",
                            transition: "background 0.18s",
                        }}
                    >
                        Contact
                    </a>
                </Link>
                <Link href="/projects" legacyBehavior>
                    <a
                        style={{
                            background: "#222c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 15,
                            padding: "7px 22px",
                            fontWeight: 500,
                            cursor: "pointer",
                            boxShadow: "0 1px 6px #0002",
                            textDecoration: "none",
                            transition: "background 0.18s",
                        }}
                    >
                        Projects
                    </a>
                </Link>
            </div>

            {/* LICENSE and source code message */}
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
                }}
            >
                LICENSE and source code available.
            </motion.div>
        </div>
    );
}
