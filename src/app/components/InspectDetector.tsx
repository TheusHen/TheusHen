"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InspectDetector = () => {
    const [isInspecting, setIsInspecting] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [explosionPhase, setExplosionPhase] = useState<"fadeOut" | "expanding" | "message">("fadeOut");

    useEffect(() => {
        // Detect developer tools opening
        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            const orientation = widthThreshold ? 'vertical' : 'horizontal';
            
            if (
                widthThreshold || 
                heightThreshold ||
                (window as any).Firebug?.chrome?.isInitialized ||
                (window as any).outerWidth - (window as any).innerWidth > 100 ||
                (window as any).outerHeight - (window as any).innerHeight > 100
            ) {
                if (!isInspecting) {
                    setIsInspecting(true);
                    setShowExplosion(true);
                    setExplosionPhase("fadeOut");
                    
                    // Start the animation sequence
                    setTimeout(() => setExplosionPhase("expanding"), 1500);
                    setTimeout(() => setExplosionPhase("message"), 3500);
                }
            }
        };

        // Check on resize and focus events
        window.addEventListener('resize', detectDevTools);
        window.addEventListener('focus', detectDevTools);
        
        // Initial check
        detectDevTools();

        // Periodic check using requestAnimationFrame for smooth detection
        let rafId: number;
        const checkLoop = () => {
            detectDevTools();
            rafId = requestAnimationFrame(checkLoop);
        };
        rafId = requestAnimationFrame(checkLoop);

        // DevTools detection using console
        let devtoolsOpen = false;
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                devtoolsOpen = true;
                if (!isInspecting) {
                    setIsInspecting(true);
                    setShowExplosion(true);
                    setExplosionPhase("fadeOut");
                    setTimeout(() => setExplosionPhase("expanding"), 1500);
                    setTimeout(() => setExplosionPhase("message"), 3500);
                }
            }
        });

        // Trigger the getter by logging
        const checkConsole = setInterval(() => {
            console.log(element);
            console.clear();
        }, 1000);

        return () => {
            window.removeEventListener('resize', detectDevTools);
            window.removeEventListener('focus', detectDevTools);
            if (rafId) cancelAnimationFrame(rafId);
            clearInterval(checkConsole);
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

                    {/* Phase 2: White explosion expanding */}
                    {explosionPhase === "expanding" && (
                        <motion.div
                            className="fixed inset-0 z-[9999] overflow-hidden"
                            style={{ pointerEvents: "all" }}
                        >
                            <motion.div
                                className="absolute top-1/2 left-1/2"
                                initial={{
                                    width: "0px",
                                    height: "0px",
                                    x: "-50%",
                                    y: "-50%",
                                    borderRadius: "50%",
                                }}
                                animate={{
                                    width: ["0px", "200vmax"],
                                    height: ["0px", "200vmax"],
                                    borderRadius: ["50%", "0%"],
                                }}
                                transition={{
                                    duration: 2,
                                    ease: [0.43, 0.13, 0.23, 0.96], // Fluid easing
                                }}
                                style={{
                                    background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,1) 100%)",
                                    filter: "blur(2px)",
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Phase 3: Message and email */}
                    {explosionPhase === "message" && (
                        <motion.div
                            className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ pointerEvents: "all" }}
                        >
                            <motion.p
                                className="text-black text-2xl md:text-4xl font-bold text-center max-w-3xl px-8 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            >
                                Feeling inspired? Let's work on a project together, I'm open to ideas!
                            </motion.p>

                            <motion.a
                                href="mailto:mmmatheushenriqueee@gmail.com"
                                className="text-red-600 text-xl md:text-3xl font-semibold hover:text-red-800 transition-colors"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                            >
                                mmmatheushenriqueee@gmail.com
                            </motion.a>

                            <motion.button
                                className="mt-12 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5, duration: 0.5 }}
                                onClick={() => {
                                    setShowExplosion(false);
                                    setIsInspecting(false);
                                    setExplosionPhase("fadeOut");
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
