import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Download } from "lucide-react";

// List of equations only (in English)
const equations = [
    "F=ma",
    "v = v_0 + at",
    "L = \\rho V",
    "P = \\frac{F}{A}",
    "E = mc^2",
    "C_L = \\frac{L}{\\frac{1}{2} \\rho V^2 S}",
    "q = \\frac{1}{2} \\rho V^2",
    "T = 2\\pi \\sqrt{\\frac{l}{g}}",
    "\\Delta p = F \\Delta t",
    "M = F \\cdot d",
    "p = \\rho g h",
    "s = s_0 + v_0 t + \\frac{1}{2} a t^2",
    "\\tau = I \\alpha",
    "Re = \\frac{\\rho v D}{\\mu}",
    "W = F d \\cos\\theta",
    "P = \\frac{W}{t}",
    "E_k = \\frac{1}{2} m v^2",
    "M = m R^2",
    "a_c = \\frac{v^2}{r}",
    "F_d = \\frac{1}{2} C_d \\rho A v^2",
];

// Helper for random float in [min, max]
function randf(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

// Helper for random id
function randId() {
    return Math.random().toString(36).slice(2, 10) + Date.now();
}

// Equation particle type
type EqParticle = {
    id: string;
    eq: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    z: number;
    collideCd: number;
};

function createEqParticle(width: number, height: number): EqParticle {
    const eq = equations[Math.floor(Math.random() * equations.length)];
    const angle = randf(0, Math.PI * 2);
    const speed = randf(1.0, 2.2);
    return {
        id: randId(),
        eq,
        x: randf(30, width - 30),
        y: randf(30, height - 80),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: randf(0.54, 0.74),
        opacity: randf(0.67, 0.93),
        z: randf(0, 1),
        collideCd: 0,
    };
}

// Mutates two equations to form a new one (just merge random parts)
function fuseEquations(eq1: string, eq2: string): string {
    const mid1 = Math.floor(eq1.length * randf(0.2, 0.8));
    const mid2 = Math.floor(eq2.length * randf(0.2, 0.8));
    const newEq = eq1.slice(0, mid1) + eq2.slice(mid2);
    return newEq.length > 3 ? newEq : equations[Math.floor(Math.random() * equations.length)];
}

const MAX_PARTICLES = 32;
const MIN_PARTICLES = 16;

// LaTeX render with loading state
function EquationLatex({
                           latex,
                           onLoaded,
                       }: {
    latex: string;
    onLoaded?: () => void;
}) {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        let didCancel = false;
        Promise.resolve().then(() => {
            try {
                const out = katex.renderToString(latex, {
                    throwOnError: false,
                    output: "html",
                });
                if (!didCancel) {
                    setHtml(out);
                    if (onLoaded) onLoaded();
                }
            } catch {
                setHtml("<span style='color:#ccc'>Invalid LaTeX</span>");
            }
        });
        return () => {
            didCancel = true;
        };
    }, [latex, onLoaded]);

    if (!html) {
        return (
            <span style={{ color: "#ff3131", fontSize: "0.95em", fontWeight: 700, opacity: 0.2 }}>
                ...
            </span>
        );
    }
    return (
        <span
            style={{
                color: "#ff3131",
                fontSize: "0.95em",
                fontWeight: 700,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default function AnimatedEquationFall() {
    // SSR safe initial dimensions, update on client
    const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const setDims = () =>
                setDimensions({ w: window.innerWidth, h: window.innerHeight });
            setDims();
            window.addEventListener("resize", setDims);
            return () => window.removeEventListener("resize", setDims);
        }
    }, []);

    // Particle initialization: only on client
    const [particles, setParticles] = useState<EqParticle[]>([]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const n = Math.floor(randf(MIN_PARTICLES, MIN_PARTICLES + 2));
            setParticles(
                Array.from({ length: n }, () =>
                    createEqParticle(window.innerWidth, window.innerHeight)
                )
            );
        }
    }, []);

    // For per-particle visibility (wait for LaTeX to load)
    const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});

    // Snackbar/notification
    const [showLatexNotice, setShowLatexNotice] = useState(false);

    // Avoid setState-loop by using callback instead of useEffect on particles
    const handleLatexLoaded = useCallback((id: string) => {
        setVisibleMap(vm => {
            if (vm[id]) return vm;
            return { ...vm, [id]: true };
        });
    }, []);

    // Animation loop
    const reqRef = useRef<number | null>(null);
    const lastUpdate = useRef(Date.now());

    useEffect(() => {
        const animate = () => {
            const now = Date.now();
            const dt = Math.min((now - lastUpdate.current) / 1000, 0.04);
            lastUpdate.current = now;

            setParticles(prevParticles => {
                const updated = prevParticles.map(p => {
                    const { x, y, vx, vy, size, collideCd, ...rest } = p;
                    let newX = x, newY = y, newVx = vx, newVy = vy;
                    if (newX < 20) { newX = 20; newVx = Math.abs(newVx) * 0.9; }
                    if (newX > dimensions.w - 20) { newX = dimensions.w - 20; newVx = -Math.abs(newVx) * 0.9; }
                    if (newY < 28) { newY = 28; newVy = Math.abs(newVy) * 0.9; }
                    if (newY > dimensions.h - 38) { newY = dimensions.h - 38; newVy = -Math.abs(newVy) * 0.9; }
                    newVx *= 0.997;
                    newVy *= 0.997;
                    if (Math.random() < 0.0007) newVy += randf(-1, 1) * 0.08;
                    const newCollideCd = Math.max(0, collideCd - dt);
                    newX += newVx * dt * 42;
                    newY += newVy * dt * 42;
                    return { ...rest, x: newX, y: newY, vx: newVx, vy: newVy, size, collideCd: newCollideCd };
                });

                for (let i = 0; i < updated.length; ++i) {
                    for (let j = i + 1; j < updated.length; ++j) {
                        const a = updated[i], b = updated[j];
                        if (a.collideCd > 0.06 || b.collideCd > 0.06) continue;
                        const r = 28 * ((a.size + b.size) / 2);
                        const dx = a.x - b.x, dy = a.y - b.y;
                        if (dx * dx + dy * dy < r * r) {
                            const fused = fuseEquations(a.eq, b.eq);
                            const angle = randf(0, Math.PI * 2);
                            const speed1 = randf(1.0, 1.7);
                            const speed2 = randf(1.0, 1.7);

                            updated[i] = {
                                ...a,
                                eq: fused,
                                vx: Math.cos(angle) * speed1,
                                vy: Math.sin(angle) * speed1,
                                collideCd: 0.35,
                                opacity: randf(0.67, 0.93)
                            };
                            updated[j] = {
                                ...b,
                                eq: fused,
                                vx: -Math.cos(angle) * speed2,
                                vy: -Math.sin(angle) * speed2,
                                collideCd: 0.35,
                                opacity: randf(0.67, 0.93)
                            };
                        }
                    }
                }

                if (updated.length < MAX_PARTICLES && Math.random() < 0.011) {
                    updated.push(createEqParticle(dimensions.w, dimensions.h));
                }
                if (updated.length > MAX_PARTICLES) updated.length = MAX_PARTICLES;

                return updated;
            });

            reqRef.current = window.requestAnimationFrame(animate);
        };
        reqRef.current = window.requestAnimationFrame(animate);
        return () => {
            if (reqRef.current !== null) {
                window.cancelAnimationFrame(reqRef.current);
            }
        };
    }, [dimensions.w, dimensions.h]);

    // Reset visibleMap only when particle IDs actually change
    useEffect(() => {
        setVisibleMap(vm => {
            const newMap: Record<string, boolean> = { ...vm };
            let changed = false;
            for (const p of particles) {
                if (!(p.id in newMap)) {
                    newMap[p.id] = false;
                    changed = true;
                }
            }
            for (const id in newMap) {
                if (!particles.some(p => p.id === id)) {
                    delete newMap[id];
                    changed = true;
                }
            }
            return changed ? newMap : vm;
        });
    }, [particles]);

    // Download all equations as a .tex file (unique only)
    const downloadAllEquations = useCallback(() => {
        const eqs = Array.from(new Set(particles.map(p => p.eq.trim()).filter(Boolean)));
        // .tex file content with align* environment for multiple equations
        const texContent =
            `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
\\begin{align*}
${eqs.map(eq => eq + " \\\\").join("\n")}
\\end{align*}
\\end{document}
`;
        const blob = new Blob([texContent], { type: "application/x-tex" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "equations.tex";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        setShowLatexNotice(true);
        setTimeout(() => setShowLatexNotice(false), 4000);
    }, [particles]);

    // Add more particles on click
    const handleAddParticles = useCallback(() => {
        setParticles(ps => {
            const toAdd = Math.min(
                Math.floor(randf(1, 3)),
                MAX_PARTICLES - ps.length
            );
            return [
                ...ps,
                ...Array.from({ length: toAdd }, () => createEqParticle(dimensions.w, dimensions.h))
            ].slice(0, MAX_PARTICLES);
        });
    }, [dimensions.w, dimensions.h]);

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
            {/* Floating equations */}
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={false}
                        animate={{
                            x: p.x,
                            y: p.y,
                            opacity: visibleMap[p.id] ? p.opacity : 0,
                            scale: p.size,
                            zIndex: Math.floor(p.z * 1000),
                        }}
                        transition={{ type: "spring", stiffness: 60, damping: 18, mass: 1.2 }}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            pointerEvents: "none",
                            color: "#ff3131",
                            fontWeight: 700,
                            userSelect: "none",
                            fontSize: "16px",
                            filter: "drop-shadow(0 0 7px #ff31313d)",
                            willChange: "transform,opacity",
                            transition: "color 0.25s",
                            minWidth: 32,
                            minHeight: 20,
                        }}
                    >
                        <EquationLatex
                            latex={p.eq}
                            onLoaded={() => handleLatexLoaded(p.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

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
                Equations float, collide and fuse, creating infinite new formulas.<br />
                Click anywhere to add more equations.
            </motion.div>

            {/* Download button */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 12,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    pointerEvents: "auto",
                }}
            >
                <button
                    onClick={downloadAllEquations}
                    style={{
                        background: "rgba(0,0,0,0.42)",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 15,
                        padding: "7px 16px 7px 12px",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px #0002",
                        backdropFilter: "blur(2px)",
                        outline: "none",
                        transition: "background 0.18s",
                    }}
                    title="Download all equations as a LaTeX .tex file"
                >
                    <Download size={18} style={{ marginBottom: 1 }} />
                    Download equations
                </button>
            </div>

            {/* Snackbar for LaTeX download */}
            <AnimatePresence>
                {showLatexNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ type: "spring", duration: 0.35 }}
                        style={{
                            position: "absolute",
                            left: "50%",
                            bottom: 80,
                            transform: "translateX(-50%)",
                            background: "#181e25ee",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "10px 32px",
                            fontSize: 15,
                            fontWeight: 500,
                            zIndex: 20,
                            boxShadow: "0 2px 12px #0007",
                            border: "1px solid #ff3131",
                            letterSpacing: 0.1,
                            pointerEvents: "none",
                        }}
                    >
                        Your equations were downloaded as a LaTeX <b>.tex</b> file!
                        <br />
                        You can edit or compile it in any LaTeX editor.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* On click, spawn more */}
            <div
                style={{
                    position: "absolute", inset: 0, zIndex: 1, cursor: "pointer"
                }}
                onClick={handleAddParticles}
            />
        </div>
    );
}