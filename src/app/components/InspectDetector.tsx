"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InspectDetector = () => {
    const [isInspecting, setIsInspecting] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [explosionPhase, setExplosionPhase] = useState<"fadeOut" | "expanding" | "message">("fadeOut");
    const hasTriggered = useRef(false);
    const initialSizeRef = useRef({ width: 0, height: 0 });

    useEffect(() => {
        // Store initial window dimensions
        initialSizeRef.current = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Wait a bit before starting detection to avoid false positives on load
        const initTimeout = setTimeout(() => {
            // Detect developer tools opening
            const detectDevTools = () => {
                if (hasTriggered.current) return;

                const widthDiff = window.outerWidth - window.innerWidth;
                const heightDiff = window.outerHeight - window.innerHeight;
                
                // More strict thresholds to avoid false positives
                // DevTools typically adds 200-400px difference
                const isDevToolsOpen = widthDiff > 200 || heightDiff > 200;
                
                if (isDevToolsOpen && !isInspecting) {
                    hasTriggered.current = true;
                    setIsInspecting(true);
                    setShowExplosion(true);
                    setExplosionPhase("fadeOut");
                    
                    // Start the animation sequence
                    setTimeout(() => setExplosionPhase("expanding"), 1500);
                    setTimeout(() => setExplosionPhase("message"), 3500);
                }
            };

            // Only check on user-initiated events
            const handleResize = () => {
                // Debounce to avoid multiple triggers
                setTimeout(detectDevTools, 300);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, 2000); // Wait 2 seconds after page load

        return () => {
            clearTimeout(initTimeout);
        };
    }, [isInspecting]);

    return (
        <AnimatePresence>
            {showExplosion && (
                <>
                    {/* Phase 1: Content fade out to black */}
                    {explosionPhase === "fadeOut" && (
                        <motion.div
                            className="fixed inset-0 bg-black z-[9999]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            style={{ pointerEvents: "all" }}
                        />
                    )}

                    {/* Phase 2: White explosion with particles */}
                    {explosionPhase === "expanding" && (
                        <motion.div
                            className="fixed inset-0 z-[9999] overflow-hidden bg-black"
                            style={{ pointerEvents: "all" }}
                        >
                            {/* Multiple explosion circles for depth */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/2"
                                    initial={{
                                        width: "0px",
                                        height: "0px",
                                        x: "-50%",
                                        y: "-50%",
                                        opacity: 0.8,
                                    }}
                                    animate={{
                                        width: ["0px", "300vmax"],
                                        height: ["0px", "300vmax"],
                                        opacity: [0.8, 0.1, 1],
                                        scale: [0, 1.5, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    style={{
                                        background: `radial-gradient(circle, 
                                            rgba(255,255,255,${0.9 - i * 0.1}) 0%, 
                                            rgba(255,255,255,${0.5 - i * 0.05}) 40%, 
                                            transparent ${60 + i * 5}%)`,
                                        borderRadius: "50%",
                                        filter: `blur(${i * 3}px)`,
                                        mixBlendMode: i % 2 === 0 ? "screen" : "normal",
                                    }}
                                />
                            ))}
                            
                            {/* Particle effects */}
                            {[...Array(20)].map((_, i) => {
                                const angle = (i / 20) * Math.PI * 2;
                                const distance = 50 + (i % 5) * 10;
                                return (
                                    <motion.div
                                        key={`particle-${i}`}
                                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                                        initial={{
                                            x: "-50%",
                                            y: "-50%",
                                            scale: 0,
                                        }}
                                        animate={{
                                            x: `calc(-50% + ${Math.cos(angle) * distance}vw)`,
                                            y: `calc(-50% + ${Math.sin(angle) * distance}vh)`,
                                            scale: [0, 1.5, 0],
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: 0.3 + (i * 0.02),
                                            ease: "easeOut",
                                        }}
                                        style={{
                                            boxShadow: "0 0 10px 2px rgba(255,255,255,0.8)",
                                        }}
                                    />
                                );
                            })}

                            {/* Final white fill */}
                            <motion.div
                                className="absolute inset-0 bg-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 1.5,
                                    ease: "easeIn"
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Phase 3: Message and email with futuristic styling */}
                    {explosionPhase === "message" && (
                        <motion.div
                            className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ pointerEvents: "all" }}
                        >
                            <motion.p
                                className="text-black text-2xl md:text-4xl font-light text-center max-w-3xl px-8 mb-8 tracking-wide"
                                style={{ 
                                    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                                    letterSpacing: "0.02em",
                                    fontWeight: 300,
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            >
                                Feeling inspired? Let's work on a project together, I'm open to ideas!
                            </motion.p>

                            <motion.a
                                href="mailto:mmmatheushenriqueee@gmail.com"
                                className="text-red-600 text-xl md:text-3xl font-thin hover:text-red-800 transition-colors tracking-wider"
                                style={{ 
                                    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                                    letterSpacing: "0.05em",
                                    fontWeight: 200,
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                            >
                                mmmatheushenriqueee@gmail.com
                            </motion.a>

                            <motion.button
                                className="mt-12 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-all font-light tracking-widest text-sm uppercase border border-black hover:shadow-lg"
                                style={{ 
                                    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                                    fontWeight: 300,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5, duration: 0.5 }}
                                onClick={() => {
                                    setShowExplosion(false);
                                    setIsInspecting(false);
                                    setExplosionPhase("fadeOut");
                                    hasTriggered.current = false;
                                }}
                            >
                                Close
                            </motion.button>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default InspectDetector;
