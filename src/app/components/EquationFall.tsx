import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Download, ArrowRight, ArrowLeft } from "lucide-react";

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

function randf(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
function randId() {
    return Math.random().toString(36).slice(2, 10) + Date.now();
}

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

function repelEquations(a: EqParticle, b: EqParticle) {
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const speedA = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
    const speedB = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    a.vx = Math.cos(angle + Math.PI) * speedA * randf(0.88, 1.08);
    a.vy = Math.sin(angle + Math.PI) * speedA * randf(0.88, 1.08);
    b.vx = Math.cos(angle) * speedB * randf(0.88, 1.08);
    b.vy = Math.sin(angle) * speedB * randf(0.88, 1.08);
    a.collideCd = 0.35;
    b.collideCd = 0.35;
}

const MIN_PARTICLES = 16;

function EquationLatex({ latex, onLoaded }: { latex: string; onLoaded?: () => void }) {
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
            <span
                style={{
                    color: "#fff",
                    fontSize: "0.95em",
                    fontWeight: 700,
                    opacity: 0.18,
                    filter: "drop-shadow(0 0 0px #fff)",
                }}
            >
                ...
            </span>
        );
    }
    return (
        <span
            style={{
                color: "#fff",
                fontSize: "0.95em",
                fontWeight: 700,
                opacity: 0.93,
                filter:
                    "drop-shadow(0 0 6px #fff7) blur(0.5px) brightness(1.12) contrast(1.13)",
                transition: "opacity 0.30s, filter 0.3s",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

const BUTTON_EFFECTS_DARK = {
    initial: { scale: 1, y: 0, boxShadow: "0 1px 6px #0002" },
    hover: {
        scale: 1.06,
        y: -2,
        boxShadow: "0 3px 20px #ff31313a, 0 1px 6px #0003",
        background: "#181c20",
        color: "#ff3131",
    },
    tap: {
        scale: 0.98,
        y: 1,
        boxShadow: "0 1px 2px #0005",
        background: "#15171a",
        color: "#ff3131",
    },
    transition: { type: "spring", stiffness: 400, damping: 22, mass: 0.9 },
};

const BUTTON_EFFECTS = {
    initial: { scale: 1, y: 0, boxShadow: "0 1px 6px #0002" },
    hover: {
        scale: 1.06,
        y: -2,
        boxShadow: "0 3px 20px #ff31313a, 0 1px 6px #0003",
        background: "#fff",
        color: "#ff3131",
    },
    tap: {
        scale: 0.98,
        y: 1,
        boxShadow: "0 1px 2px #0005",
        background: "#f4f4f4",
        color: "#ff3131",
    },
    transition: { type: "spring", stiffness: 400, damping: 22, mass: 0.9 },
};

function useWindowSize() {
    const isClient = typeof window !== "undefined";
    function get() {
        return {
            width: isClient ? window.innerWidth : 1024,
            height: isClient ? window.innerHeight : 768,
        };
    }
    const [windowSize, setWindowSize] = useState(get);
    useEffect(() => {
        if (!isClient) return;
        function handleResize() {
            setWindowSize(get());
        }
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);
    return windowSize;
}

export default function AnimatedEquationFall() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [safeRect, setSafeRect] = useState({
        left: 0,
        right: 900,
        width: 900,
        top: 0,
        bottom: 370,
        height: 370,
    });

    // Só atualiza safeRect quando o tamanho do container mudar!
    useEffect(() => {
        function updateRect() {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setSafeRect({
                    left: 0,
                    right: rect.width,
                    width: rect.width,
                    top: 0,
                    bottom: rect.height,
                    height: rect.height,
                });
            }
        }
        updateRect();
        window.addEventListener("resize", updateRect);
        window.addEventListener("orientationchange", updateRect);
        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("orientationchange", updateRect);
        };
    }, []);

    // Só gera partículas na montagem e quando o tamanho muda
    const [particles, setParticles] = useState<EqParticle[]>([]);
    const particlesRef = useRef<EqParticle[]>([]); // Referência para o estado atual das partículas
    useEffect(() => {
        const n = Math.floor(randf(MIN_PARTICLES, MIN_PARTICLES + 2));
        const newParticles = Array.from({ length: n }, () =>
            createEqParticle(safeRect.width, safeRect.height)
        );
        setParticles(newParticles);
        particlesRef.current = newParticles;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeRect.width, safeRect.height]);

    // Controla a visibilidade do LaTeX, apenas para animação de fade
    const visibleMapRef = useRef<Record<string, boolean>>({});
    const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
    const handleLatexLoaded = useCallback((id: string) => {
        if (!visibleMapRef.current[id]) {
            const updated = { ...visibleMapRef.current, [id]: true };
            visibleMapRef.current = updated;
            setVisibleMap(updated);
        }
    }, []);
    useEffect(() => {
        visibleMapRef.current = visibleMap;
    }, [visibleMap]);
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
            if (changed) {
                visibleMapRef.current = newMap;
                return newMap;
            }
            return vm;
        });
    }, [particles]);

    // Movimento automático das partículas
    const reqRef = useRef<number | null>(null);
    const lastUpdate = useRef(Date.now());
    useEffect(() => {
        function animate() {
            const now = Date.now();
            const dt = Math.min((now - lastUpdate.current) / 1000, 0.04);
            lastUpdate.current = now;

            const marginX = 18;
            const marginY = 22;
            const updatedParticles = particlesRef.current.map(p => {
                const { x, y, vx, vy, size, collideCd, ...rest } = p;
                let newX = x, newY = y, newVx = vx, newVy = vy;
                if (newX < safeRect.left + marginX) {
                    newX = safeRect.left + marginX;
                    newVx = Math.abs(newVx) * 0.88;
                }
                if (newX > safeRect.right - marginX) {
                    newX = safeRect.right - marginX;
                    newVx = -Math.abs(newVx) * 0.88;
                }
                if (newY < safeRect.top + marginY) {
                    newY = safeRect.top + marginY;
                    newVy = Math.abs(newVy) * 0.88;
                }
                if (newY > safeRect.bottom - marginY) {
                    newY = safeRect.bottom - marginY;
                    newVy = -Math.abs(newVy) * 0.88;
                }
                newVx *= 0.995;
                newVy *= 0.995;
                if (Math.random() < 0.0007) newVy += randf(-1, 1) * 0.06;
                const newCollideCd = Math.max(0, collideCd - dt);
                newX += newVx * dt * 36;
                newY += newVy * dt * 36;
                return { ...rest, x: newX, y: newY, vx: newVx, vy: newVy, size, collideCd: newCollideCd };
            });

            // Detecte colisões
            for (let i = 0; i < updatedParticles.length; ++i) {
                for (let j = i + 1; j < updatedParticles.length; ++j) {
                    const a = updatedParticles[i], b = updatedParticles[j];
                    if (a.collideCd > 0.06 || b.collideCd > 0.06) continue;
                    const r = 23 * ((a.size + b.size) / 2);
                    const dx = a.x - b.x, dy = a.y - b.y;
                    if (dx * dx + dy * dy < r * r) {
                        repelEquations(a, b);
                    }
                }
            }

            // Atualize o estado apenas se necessário
            particlesRef.current = updatedParticles;
            setParticles(prevParticles => {
                if (JSON.stringify(prevParticles) !== JSON.stringify(updatedParticles)) {
                    return updatedParticles;
                }
                return prevParticles;
            });

            reqRef.current = window.requestAnimationFrame(animate);
        }

        reqRef.current = window.requestAnimationFrame(animate);
        return () => {
            if (reqRef.current !== null) {
                window.cancelAnimationFrame(reqRef.current);
            }
        };
    }, [safeRect]);

    // Download das equações
    const [showLatexNotice, setShowLatexNotice] = useState(false);
    const downloadAllEquations = useCallback(() => {
        const eqs = Array.from(new Set(particles.map(p => p.eq.trim()).filter(Boolean)));
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

    // Botões
    const handleGoProjects = useCallback(() => {
        window.location.href = "/projects";
    }, []);
    const handleGoContact = useCallback(() => {
        window.location.href = "/contact";
    }, []);
    const { width: innerWidth } = useWindowSize();
    const TOP_BUTTONS_OFFSET = innerWidth < 600 ? 65 : 150;
    const getHeight = () => {
        if (typeof window === "undefined") return 370;
        const vw = innerWidth;
        if (vw < 500) return Math.max(220, Math.min(300, vw * 0.8));
        if (vw < 900) return Math.max(220, Math.min(340, vw * 0.38));
        return 370;
    };
    const getButtonPadding = () => {
        const vw = innerWidth;
        if (vw < 400) return "6px 9px 6px 9px";
        if (vw < 600) return "7px 13px 7px 10px";
        return "7px 18px 7px 12px";
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                maxWidth: "100vw",
                height: getHeight(),
                minHeight: 180,
                background: "transparent",
                overflow: "hidden",
                position: "relative",
                fontFamily: "system-ui,Roboto,sans-serif",
                marginBottom: 0,
                touchAction: "none",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: TOP_BUTTONS_OFFSET,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 40,
                    gap: innerWidth < 400 ? 7 : innerWidth < 600 ? 12 : 18,
                    pointerEvents: "auto",
                    flexDirection: innerWidth < 500 ? "column" : "row",
                }}
            >
                <motion.button
                    onClick={handleGoProjects}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    variants={BUTTON_EFFECTS_DARK}
                    transition={BUTTON_EFFECTS_DARK.transition}
                    style={{
                        background: "#181c20",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: innerWidth < 400 ? 13 : 15,
                        padding: getButtonPadding(),
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px #0004",
                        outline: "none",
                        transition: "background 0.18s, color 0.22s",
                        width: innerWidth < 400 ? "94vw" : undefined,
                        maxWidth: "95vw",
                    }}
                    title="Go to Projects"
                >
                    <ArrowLeft size={18} style={{ marginBottom: 1, marginRight: -3 }} />
                    Projects
                </motion.button>
                <motion.button
                    onClick={handleGoContact}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    variants={BUTTON_EFFECTS_DARK}
                    transition={BUTTON_EFFECTS_DARK.transition}
                    style={{
                        background: "#181c20",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: innerWidth < 400 ? 13 : 15,
                        padding: getButtonPadding(),
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px #0004",
                        outline: "none",
                        transition: "background 0.18s, color 0.22s",
                        width: innerWidth < 400 ? "94vw" : undefined,
                        maxWidth: "95vw",
                    }}
                    title="Contact"
                >
                    Contact
                    <ArrowRight size={18} style={{ marginBottom: 1, marginLeft: -3 }} />
                </motion.button>
            </div>
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
                            color: "#fff",
                            fontWeight: 700,
                            userSelect: "none",
                            fontSize: innerWidth < 600 ? "13px" : "16px",
                            filter: "drop-shadow(0 0 10px #fff7) blur(0.5px)",
                            willChange: "transform,opacity",
                            minWidth: 22,
                            minHeight: 16,
                            transition: "color 0.25s, filter 0.22s",
                        }}
                    >
                        <EquationLatex
                            latex={p.eq}
                            onLoaded={() => handleLatexLoaded(p.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 0.85, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: innerWidth < 500 ? 42 : 54,
                    color: "#fff",
                    fontSize: innerWidth < 400 ? 11 : 13,
                    textAlign: "center",
                    zIndex: 2,
                    pointerEvents: "auto",
                    textShadow: "0 0 5px #000a, 0 0 1px #fff",
                    letterSpacing: 1,
                    padding: innerWidth < 400 ? "0 6vw" : undefined,
                }}
            >
                Under MIT License
                <br />
                <a
                    href="https://github.com/TheusHen/TheusHen"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#ff3131",
                        opacity: 1,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        fontSize: innerWidth < 400 ? 12 : 14,
                        textDecoration: "underline",
                        cursor: "pointer",
                        pointerEvents: "auto",
                        transition: "color 0.2s",
                        wordBreak: "break-all",
                    }}
                    tabIndex={0}
                >
                    Source Code
                </a>
            </motion.div>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: innerWidth < 400 ? 7 : 12,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    pointerEvents: "auto",
                }}
            >
                <motion.button
                    onClick={downloadAllEquations}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    variants={BUTTON_EFFECTS}
                    transition={BUTTON_EFFECTS.transition}
                    style={{
                        background: "#fff",
                        border: "none",
                        borderRadius: 8,
                        color: "#ff3131",
                        fontSize: innerWidth < 400 ? 13 : 15,
                        padding: getButtonPadding(),
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px #0002",
                        outline: "none",
                        transition: "background 0.18s, color 0.22s",
                        width: innerWidth < 400 ? "94vw" : undefined,
                        maxWidth: "95vw",
                    }}
                    title="Download all equations as a LaTeX .tex file"
                >
                    <Download size={18} style={{ marginBottom: 1 }} />
                    Download equations
                </motion.button>
            </div>
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
                            bottom: innerWidth < 500 ? 60 : 80,
                            transform: "translateX(-50%)",
                            background: "#181e25ee",
                            color: "#fff",
                            borderRadius: 8,
                            padding: innerWidth < 400 ? "8px 10vw" : "10px 32px",
                            fontSize: innerWidth < 400 ? 12 : 15,
                            fontWeight: 500,
                            zIndex: 20,
                            boxShadow: "0 2px 12px #0007",
                            border: "1px solid #ff3131",
                            letterSpacing: 0.1,
                            pointerEvents: "none",
                            width: innerWidth < 400 ? "94vw" : undefined,
                            maxWidth: "97vw",
                        }}
                    >
                        Your equations were downloaded as a LaTeX <b>.tex</b> file!
                        <br />
                        You can edit or compile it in any LaTeX editor.
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                @media (max-width: 600px) {
                    .eq-fall-btns {
                        flex-direction: column !important;
                        gap: 10px !important;
                    }
                }
                @media (max-width: 400px) {
                    .eq-fall-btns button,
                    .eq-fall-download {
                        font-size: 13px !important;
                        padding: 6px 9px 6px 9px !important;
                        width: 94vw !important;
                    }
                }
            `}</style>
        </div>
    );
}

