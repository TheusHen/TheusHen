"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { ArrowLeft } from "lucide-react";
import Particles from "@/app/components/particles";
import Confetti from "react-confetti";

// Lista das imagens do carrossel
const images = [
    {
        src: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/MIT_Seal.svg/270px-MIT_Seal.svg.png",
        alt: "MIT Seal",
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.png/330px-Harvard_University_shield.png",
        alt: "Harvard Shield",
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Northwestern_University_seal.svg/270px-Northwestern_University_seal.svg.png",
        alt: "Northwestern Seal",
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/255px-Yale_University_Shield_1.svg.png",
        alt: "Yale Shield",
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/330px-Seal_of_Leland_Stanford_Junior_University.svg.png",
        alt: "Stanford Seal",
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Princeton_seal.svg/320px-Princeton_seal.svg.png",
        alt: "Princeton Seal",
    },
    {
        src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Caltech_Logo_New.png",
        alt: "Caltech Logo",
    },
];

// Calcula o tempo restante até a data alvo
function getTimeLeft(targetDate: Date) {
    const now = typeof window !== "undefined" ? new Date().getTime() : 0;
    const target = targetDate.getTime();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return { days, hours, mins, secs };
}

// Helper para saber se está em mobile
function isMobile() {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 600;
}

export default function AutoCarousel() {
    // Responsividade: define slidesPerView conforme a largura da tela
    const [slidesPerView, setSlidesPerView] = useState(3);
    // Estado para saber se é mobile
    const [mobile, setMobile] = useState(isMobile());
    // Estado para mostrar confete só quando timer zerar
    const [showConfetti, setShowConfetti] = useState(false);

    // Data alvo (estável)
    const targetDate = useMemo(() => new Date("2027-11-01T00:00:00Z"), []);

    // Atualiza responsividade
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1280) {
                setSlidesPerView(4);
            } else if (window.innerWidth >= 900) {
                setSlidesPerView(3.2);
            } else if (window.innerWidth >= 600) {
                setSlidesPerView(2.3);
            } else {
                setSlidesPerView(1.3);
            }
            setMobile(isMobile());
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Monitorar se timer chegou a zero
    const handleTimerZero = React.useCallback(() => {
        setShowConfetti(true);
    }, []);

    // Garante que o autoplay inicia junto com o carregamento, inclusive no mobile
    // Swiper com autoplay inicia automaticamente, mas garantimos reatividade ao "mobile"
    // Não precisa de useEffect extra, pois o Swiper lê o valor de "mobile" dinamicamente

    return (
        <div
            style={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "transparent",
                position: "relative",
                overflow: "hidden",
                paddingTop: 0,
                paddingBottom: "60px",
            }}
        >
            {/* Efeito de Confeti só quando timer zerar */}
            {showConfetti && <Confetti />}
            <Particles
                className="absolute inset-0 -z-10 animate-fade-in"
                quantity={85}
            />
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center mb-6 animate-fade-in w-full px-8 pt-8 mt-8" style={{maxWidth: "1700px"}}>
                <button className="text-2xl cursor-pointer transition-transform hover:-translate-x-1 text-white" onClick={() => window.location.href = '/'}>
                    <ArrowLeft />
                </button>
                <div className="flex space-x-6">
                    <button className="text-lg hover:text-red-400 transition-colors" onClick={() => window.location.href = '/projects'}>
                        Projects
                    </button>
                    <button className="text-lg hover:text-red-400 transition-colors" onClick={() => window.location.href = '/contact'}>
                        Contact
                    </button>
                </div>
            </div>

            {/* Carrossel centralizado e responsivo */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1700px",
                    minWidth: "0",
                    height: "min(34vw,340px)",
                    minHeight: 220,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "visible",
                    marginBottom: "28px",
                    paddingLeft: "max(3vw,12px)",
                    paddingRight: "max(3vw,12px)",
                    boxSizing: "border-box",
                }}
            >
                <Swiper
                    modules={[EffectCoverflow, Autoplay]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={slidesPerView}
                    loop={true}
                    autoplay={{
                        delay: mobile ? 700 : 2100, // velocidade maior no mobile
                        disableOnInteraction: false,
                        pauseOnMouseEnter: !mobile, // No mobile, ignore hover
                    }}
                    speed={mobile ? 650 : 480}
                    coverflowEffect={{
                        rotate: 30,
                        stretch: 0,
                        depth: 120,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    {images.map((img) => (
                        <SwiperSlide key={img.src} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                        }}>
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={220}
                                height={220}
                                style={{
                                    objectFit: "contain",
                                    background: "transparent",
                                    borderRadius: 0,
                                    boxShadow: "none",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                    minWidth: 80,
                                    maxWidth: "min(23vw,220px)",
                                    minHeight: 80,
                                    maxHeight: "min(23vw,220px)",
                                    transition: "transform 0.2s"
                                }}
                                draggable={false}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* TimerSection logo abaixo do carrossel */}
            <TimerSection
                targetDate={targetDate}
                onTimerZero={handleTimerZero}
            />
            <style jsx global>{`
                @media (max-width: 900px) {
                    .swiper-slide img {
                        max-width: 150px !important;
                        max-height: 150px !important;
                    }
                }
                @media (max-width: 600px) {
                    .swiper-slide img {
                        max-width: 110px !important;
                        max-height: 110px !important;
                    }
                }
            `}</style>
        </div>
    );
}

// TimerSection: sempre abaixo do carrossel, com animação GSAP
function TimerSection({
                          targetDate,
                          onTimerZero,
                      }: {
    targetDate: Date;
    onTimerZero: () => void;
}) {
    // Inicializa o timer "hidratado" já no client, usando um fallback estável no SSR
    const [timer, setTimer] = useState(() =>
        typeof window === "undefined"
            ? { days: 0, hours: 0, mins: 0, secs: 0 }
            : getTimeLeft(targetDate)
    );
    const timerRef = useRef<HTMLDivElement>(null);

    // Evita hydration mismatch: só atualiza timer após montagem
    useEffect(() => {
        setTimer(getTimeLeft(targetDate));
        const interval = setInterval(() => {
            const t = getTimeLeft(targetDate);
            setTimer(t);
            // Confete só quando zerar
            if (t.days === 0 && t.hours === 0 && t.mins === 0 && t.secs === 0) {
                onTimerZero();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate, onTimerZero]);

    // GSAP animação ao atualizar o timer
    useEffect(() => {
        if (timerRef.current) {
            gsap.fromTo(
                timerRef.current.querySelectorAll(".timer-value"),
                { scale: 1.05, color: "#fff" },
                {
                    scale: 1,
                    color: "#f87171",
                    duration: 0.25,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut",
                    stagger: 0.05,
                }
            );
        }
    }, [timer.days, timer.hours, timer.mins, timer.secs]);

    return (
        <div
            ref={timerRef}
            className="flex flex-col h-40 items-center justify-center"
            style={{
                marginTop: 0,
                marginBottom: "0px",
                minWidth: 320,
                maxWidth: 440,
                background: "transparent",
                boxShadow: "none",
            }}
        >
            <span className="text-lg font-semibold text-red-300 mb-2">
                Time left until my College Application
            </span>
            <div className="flex gap-3 text-white text-2xl font-mono tracking-wider">
                <div className="flex flex-col items-center">
                    <span className="timer-value">{timer.days}</span>
                    <span className="text-xs text-red-400">days</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span className="timer-value">{timer.hours}</span>
                    <span className="text-xs text-red-400">h</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span className="timer-value">{timer.mins}</span>
                    <span className="text-xs text-red-400">min</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span className="timer-value">{timer.secs}</span>
                    <span className="text-xs text-red-400">s</span>
                </div>
            </div>
        </div>
    );
}