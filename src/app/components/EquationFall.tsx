import React, { useRef, useEffect, useCallback, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import { FileDown, Mail, FolderKanban } from "lucide-react";

const EQUATIONS: { eq: string; difficulty: number }[] = [
    { eq: "a^2 + b^2 = c^2", difficulty: 0 },
    { eq: "E=mc^2", difficulty: 0 },
    { eq: "F=ma", difficulty: 0 },
    { eq: "PV = nRT", difficulty: 0 },
    { eq: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}", difficulty: 2 },
    { eq: "e^{i\\pi} + 1 = 0", difficulty: 1 },
    { eq: "\\frac{d}{dx}e^x = e^x", difficulty: 0 },
    { eq: "\\lim_{n \\to \\infty} \\left(1+\\frac{1}{n}\\right)^n = e", difficulty: 1 },
    { eq: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}", difficulty: 2 },
    { eq: "\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}", difficulty: 2 },
    { eq: "\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})", difficulty: 2 },
    { eq: "\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}", difficulty: 2 },
    { eq: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi", difficulty: 3 },
    { eq: "\\nabla \\times \\vec{B} = \\mu_0 \\vec{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}", difficulty: 3 },
    { eq: "\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{in}}}{\\varepsilon_0}", difficulty: 2 },
    { eq: "\\Delta S \\geq 0", difficulty: 1 },
    { eq: "\\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^{\\infty} e^{-\\frac{1}{2}x^2} dx = 1", difficulty: 2 },
    { eq: "\\mathcal{L} = T - V", difficulty: 1 },
    { eq: "\\frac{\\partial u}{\\partial t} = D\\nabla^2 u", difficulty: 2 }
];

const MIN_PARTICLES = 18;
const PARTICLE_SIZE_RANGE = [0.38, 0.52];
const VELOCITY_RANGE = [6, 11];
const COLLISION_RADIUS = 46;
const COOLDOWN_MS = 1200;
const FADE_DURATION = 0.7;

function getEquationColor(difficulty: number) {
    const colors = ["#fff", "#ffb3b3", "#ff5959", "#ff1010"];
    return colors[Math.max(0, Math.min(colors.length - 1, difficulty))];
}
function randomBetween(a: number, b: number) {
    return a + Math.random() * (b - a);
}
function randomInt(a: number, b: number) {
    return Math.floor(randomBetween(a, b + 1));
}
function getResponsiveParticleCount(width: number, height: number) {
    return Math.max(
        MIN_PARTICLES,
        Math.min(44, Math.round((width * height) / 4800))
    );
}

type Particle = {
    id: number;
    eq: string;
    color: string;
    difficulty: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    z: number;
    collisionCooldown: number;
    t: number;
};

function getInitialParticle(
    id: number,
    width: number,
    height: number
): Particle {
    const eqIdx = randomInt(0, EQUATIONS.length - 1);
    const { eq, difficulty } = EQUATIONS[eqIdx];
    const size = randomBetween(PARTICLE_SIZE_RANGE[0], PARTICLE_SIZE_RANGE[1]);
    const x = randomBetween(60, width - 60);
    const y = randomBetween(60, height - 60);
    let vx = randomBetween(-1, 1) * randomBetween(1, 2);
    let vy = randomBetween(-1, 1) * randomBetween(1, 2);
    const speed = randomBetween(VELOCITY_RANGE[0], VELOCITY_RANGE[1]);
    const norm = Math.sqrt(vx * vx + vy * vy) || 1;
    vx = (vx / norm) * speed;
    vy = (vy / norm) * speed;
    const z = randomBetween(0.5, 1.5);
    return {
        id,
        eq,
        difficulty,
        color: getEquationColor(difficulty),
        x, y, vx, vy, size, opacity: 0, z,
        collisionCooldown: 0,
        t: randomBetween(0, 10000)
    };
}

// Removed respawnParticle (unused)

type KatexProps = {
    latex: string;
    color?: string;
    size?: number;
    onLoad?: () => void;
};
const KatexEquation: React.FC<KatexProps> = ({ latex, color, size = 1, onLoad }) => {
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (ref.current) {
            try {
                katex.render(latex, ref.current, {
                    throwOnError: false,
                    displayMode: false,
                    output: 'html'
                });
                if (color) ref.current.style.color = color;
                if (size) ref.current.style.fontSize = `${size}em`;
                if (onLoad) onLoad();
            } catch {
                if (ref.current) ref.current.innerText = "Error";
            }
        }
    }, [latex, color, size, onLoad]); // Added onLoad to deps
    return <span ref={ref} aria-label={latex} tabIndex={0} />;
};

const AnimatedEquationFall: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1280, height: 600 });
    const [particles, setParticles] = useState<Particle[]>([]);
    const [downloaded, setDownloaded] = useState(false);

    useLayoutEffect(() => {
        function updateDimensions() {
            if (containerRef.current) {
                const { offsetWidth: width, offsetHeight: height } = containerRef.current;
                setDimensions({ width, height });
            }
        }
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        const count = getResponsiveParticleCount(dimensions.width, dimensions.height);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setParticles(_ =>
            Array.from({ length: count }, (_, i) =>
                getInitialParticle(i, dimensions.width, dimensions.height)
            )
        );
    }, [dimensions.width, dimensions.height]);

    useEffect(() => {
        let last = performance.now();
        let raf: number;
        function animate(now: number) {
            const dt = Math.min((now - last) / 1000, 0.04);
            last = now;
            setParticles(prevParticles => {
                const next = prevParticles.map(p => ({ ...p }));
                for (const p of next) {
                    p.t += dt;
                    const floatY = Math.sin(p.t * 0.65 + p.id) * 6;
                    const floatX = Math.cos(p.t * 0.52 + p.id) * 5;
                    p.x += p.vx * dt + floatX * dt * 0.22;
                    p.y += p.vy * dt + floatY * dt * 0.18;
                    if (p.opacity < 1) {
                        p.opacity = Math.min(1, p.opacity + dt / FADE_DURATION);
                    }
                }
                for (let i = 0; i < next.length; i++) {
                    for (let j = i + 1; j < next.length; j++) {
                        const a = next[i], b = next[j];
                        if (a.collisionCooldown > 0 || b.collisionCooldown > 0) continue;
                        const dx = b.x - a.x, dy = b.y - a.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < COLLISION_RADIUS * (0.7 + 0.3 * (a.size + b.size) / 2)) {
                            const angle = Math.atan2(dy, dx);
                            const force = 0.4;
                            a.vx -= Math.cos(angle) * force;
                            a.vy -= Math.sin(angle) * force;
                            b.vx += Math.cos(angle) * force;
                            b.vy += Math.sin(angle) * force;
                            a.collisionCooldown = COOLDOWN_MS;
                            b.collisionCooldown = COOLDOWN_MS;
                        }
                    }
                }
                for (const p of next) {
                    if (p.collisionCooldown > 0) p.collisionCooldown -= dt * 1000;
                }
                for (let i = 0; i < next.length; i++) {
                    const p = next[i];
                    const margin = 2;
                    const eqSize = 16 + p.size * 10;
                    if (p.x < margin) {
                        p.x = margin;
                        if (p.vx < 0) p.vx = Math.abs(p.vx) * (0.7 + Math.random() * 0.2);
                    } else if (p.x > dimensions.width - margin - eqSize) {
                        p.x = dimensions.width - margin - eqSize;
                        if (p.vx > 0) p.vx = -Math.abs(p.vx) * (0.7 + Math.random() * 0.2);
                    }
                    if (p.y < margin) {
                        p.y = margin;
                        if (p.vy < 0) p.vy = Math.abs(p.vy) * (0.7 + Math.random() * 0.2);
                    } else if (p.y > dimensions.height - margin - eqSize) {
                        p.y = dimensions.height - margin - eqSize;
                        if (p.vy > 0) p.vy = -Math.abs(p.vy) * (0.7 + Math.random() * 0.2);
                    }
                }
                return next;
            });
            raf = requestAnimationFrame(animate);
        }
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [dimensions, particles.length]);

    const [loadedMap, setLoadedMap] = useState<{ [id: number]: boolean }>({});
    const handleEqLoad = useCallback(
        (id: number) => setLoadedMap(map => ({ ...map, [id]: true })),
        []
    );

    const handleDownload = () => {
        const texContent =
            "% Famous equations, exported by AnimatedEquationFall\n" +
            particles
                .map(
                    p =>
                        `% Equation #${p.id + 1} (difficulty ${p.difficulty})\n\\[\n${p.eq}\n\\]\n`
                )
                .join("\n");
        const blob = new Blob([texContent], { type: "text/x-tex" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "equations.tex";
        a.click();
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2500);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    };

    return (
        <div
            ref={containerRef}
            tabIndex={-1}
            aria-label="Animated equations floating"
            style={{
                width: "100%",
                minHeight: "60vh",
                position: "relative",
                overflow: "hidden",
                background: "transparent",
                borderRadius: "1.5rem",
                boxShadow: "none"
            }}
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: loadedMap[p.id] ? p.opacity : 0.1,
                        scale: 1,
                        x: p.x,
                        y: p.y,
                        zIndex: Math.round(100 * p.z)
                    }}
                    transition={{
                        opacity: { duration: FADE_DURATION },
                        x: { type: "tween", duration: 0 },
                        y: { type: "tween", duration: 0 }
                    }}
                    style={{
                        position: "absolute",
                        pointerEvents: "none",
                        userSelect: "none",
                        fontWeight: 600,
                        filter: `drop-shadow(0 2px 8px #0004)`,
                        color: p.color,
                        fontSize: `${p.size}em`,
                        opacity: 0.32 + 0.20 * p.z
                    }}
                    aria-hidden
                >
                    <KatexEquation
                        latex={p.eq}
                        color={p.color}
                        size={p.size}
                        onLoad={() => handleEqLoad(p.id)}
                    />
                </motion.div>
            ))}

            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 200,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.1em",
                    pointerEvents: "auto"
                }}
            >
                <AnimatedButton
                    as="a"
                    href="/projects"
                    label="Projects"
                    ariaLabel="Go to Projects page"
                    color="#ff1010"
                    icon={<FolderKanban size={20} />}
                />
                <AnimatedButton
                    as="a"
                    href="/contact"
                    label="Contact"
                    ariaLabel="Go to Contact page"
                    color="#ff1010"
                    icon={<Mail size={19} />}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "4.4em",
                    transform: "translateX(-50%)",
                    zIndex: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pointerEvents: "none",
                    width: "100%"
                }}
            >
                <div
                    style={{
                        marginBottom: "0.7em",
                        fontSize: 13,
                        color: "#fff",
                        opacity: 1,
                        pointerEvents: "auto",
                        fontWeight: 600,
                        letterSpacing: 0.01,
                        textShadow: "0 1px 8px #2225"
                    }}
                >
                    <a
                        href="https://github.com/TheusHen/TheusHen"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline dashed", color: "#fff" }}
                    >
                        MIT License — View source
                    </a>
                </div>
                <div style={{ pointerEvents: "auto" }}>
                    <AnimatedButton
                        label="Download .tex"
                        ariaLabel="Download all visible equations in .tex format"
                        color="#ff1010"
                        icon={<FileDown size={21} />}
                        onClick={handleDownload}
                    />
                </div>
            </div>

            <AnimatePresence>
                {downloaded && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.45 }}
                        style={{
                            position: "fixed",
                            left: "50%",
                            bottom: "8vh",
                            transform: "translateX(-50%)",
                            background: "linear-gradient(90deg,#ff1010 40%,#ff5959 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1.1em",
                            padding: "1em 2em",
                            borderRadius: 13,
                            boxShadow: "0 6px 22px -8px #2221a045",
                            zIndex: 99999
                        }}
                        role="status"
                        aria-live="polite"
                    >
                        Arquivo <b>equations.tex</b> baixado!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

type AnimatedButtonProps = {
    as?: "a" | "button";
    href?: string;
    label: string;
    color: string;
    onClick?: () => void;
    ariaLabel?: string;
    icon?: React.ReactNode;
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
                                                           as = "button",
                                                           href,
                                                           label,
                                                           color,
                                                           onClick,
                                                           ariaLabel,
                                                           icon
                                                       }) => {
    const baseStyles: React.CSSProperties = {
        background: "linear-gradient(90deg, #fff2 0%, #ff1010cc 100%)",
        color: "#fff",
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "#ff1010",
        borderRadius: "17px",
        fontSize: "1.11em",
        fontWeight: 800,
        cursor: "pointer",
        minWidth: 122,
        padding: "0.73em 1.6em",
        boxShadow: `0 4px 28px -5px #ff101032, 0 1px 2px #ff101044`,
        outline: "none",
        margin: "0 0.2em",
        userSelect: "none",
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "0.7em",
        letterSpacing: 0.04,
        transition: "all 0.19s cubic-bezier(.22,1,.36,1)"
    };

    const hoverStyles: React.CSSProperties = {
        background: "#fff0",
        color: color,
        boxShadow: `0 2px 24px 1px #ff101088, 0 0 0 2px #ff1010bb`,
        borderColor: "#ff1010"
    };

    const [isHovered, setIsHovered] = useState(false);

    if (as === "a" && href) {
        return (
            <motion.a
                href={href}
                style={{ ...baseStyles, ...(isHovered ? hoverStyles : {}) }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                aria-label={ariaLabel || label}
                tabIndex={0}
                role="button"
            >
                {icon}
                {label}
            </motion.a>
        );
    }
    return (
        <motion.button
            type="button"
            style={{ ...baseStyles, ...(isHovered ? hoverStyles : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            aria-label={ariaLabel || label}
            tabIndex={0}
            role="button"
        >
            {icon}
            {label}
        </motion.button>
    );
};

export default AnimatedEquationFall;
