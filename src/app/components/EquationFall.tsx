import React from "react";
import { motion } from "framer-motion";

export default function AnimatedEquationFall() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                background: "transparent",
                overflow: "hidden",
                position: "relative",
                touchAction: "none",
                fontFamily: "system-ui,Roboto,sans-serif",
            }}
        >
            {/* Instructions (in English, subtle, smaller) */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 0.25, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 54,
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
