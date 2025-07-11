"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import {
  SiPython, SiGo, SiJavascript, SiTypescript, SiDart, SiHtml5, SiCss3,
  SiReact, SiFastapi, SiElectron, SiFlutter, SiNodedotjs, SiTailwindcss,
  SiDebian, SiGit, SiGithub, SiCloudflare,
} from "react-icons/si";
import "swiper/css";
import "swiper/css/effect-coverflow";

const techIcons = [
  { icon: <SiPython />, name: "Python", color: "#3776AB" },
  { icon: <SiGo />, name: "Golang", color: "#00ADD8" },
  { icon: <SiJavascript />, name: "JavaScript", color: "#F7DF1E" },
  { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
  { icon: <SiDart />, name: "Dart", color: "#0175C2" },
  { icon: <SiHtml5 />, name: "HTML", color: "#E34F26" },
  { icon: <SiCss3 />, name: "CSS", color: "#1572B6" },
  { icon: <SiReact />, name: "React", color: "#61DAFB" },
  { icon: <SiFastapi />, name: "FastAPI", color: "#009688" },
  { icon: <SiElectron />, name: "Electron", color: "#47848F" },
  { icon: <SiFlutter />, name: "Flutter", color: "#02569B" },
  { icon: <SiNodedotjs />, name: "Node.js", color: "#339933" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS", color: "#38BDF8" },
  { icon: <SiDebian />, name: "Debian", color: "#A81D33" },
  { icon: <SiGit />, name: "Git", color: "#F05032" },
  { icon: <SiGithub />, name: "GitHub", color: "#fff" },
  { icon: <SiCloudflare />, name: "Cloudflare", color: "#F38020" },
];

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 600;
}

export default function TechCarousel() {
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1280) {
        setSlidesPerView(6);
      } else if (window.innerWidth >= 900) {
        setSlidesPerView(4.2);
      } else if (window.innerWidth >= 600) {
        setSlidesPerView(3.2);
      } else {
        setSlidesPerView(1.4);
      }
      setMobile(isMobile());
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const iconsLoop = [...techIcons, ...techIcons];

  return (
    <div className="tech-carousel-bg">
      <div className="tech-carousel-blur" />
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
          paddingLeft: "max(3vw,12px)",
          paddingRight: "max(3vw,12px)",
          boxSizing: "border-box",
          zIndex: 2,
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
            delay: mobile ? 700 : 2100,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={mobile ? 650 : 480}
          coverflowEffect={{
            rotate: 32,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          {iconsLoop.map((tech, idx) => (
            <SwiperSlide
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                minWidth: 80,
                maxWidth: "min(23vw, 180px)",
                minHeight: 80,
                maxHeight: "min(23vw,180px)",
                transition: "transform 0.2s",
                filter: "drop-shadow(0 4px 28px rgba(0,0,0,0.13))",
              }}
            >
              <div
                className="flex flex-col items-center select-none w-24 pointer-events-auto group icon-animate"
                style={{
                  pointerEvents: "auto",
                  userSelect: "none",
                }}
              >
                <span
                  className="text-4xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-lg"
                  style={{
                    fontSize: mobile ? 36 : 44,
                    color: tech.color,
                    transition: "color 0.2s, transform 0.3s",
                    textShadow: "0 0 8px rgba(0,0,0,0.30), 0 2px 10px rgba(0,0,0,0.18)",
                    filter: "brightness(1.15)",
                  }}
                >
                  {tech.icon}
                </span>
                <span
                  className="text-xs mt-1 font-medium"
                  style={{
                    fontSize: mobile ? 11 : 14,
                    color: "#fff",
                    letterSpacing: 0.5,
                    textShadow: "0 0 4px #222, 0 1px 5px #0008",
                  }}
                >
                  {tech.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`  
        .icon-animate {
          animation: iconglow 2.8s cubic-bezier(.77,0,.18,1) infinite alternate;
        }
        .swiper-slide-active .icon-animate span.text-4xl {
          filter: drop-shadow(0 0 24px #fff7) brightness(1.33);
          animation: iconpulse 2.1s cubic-bezier(.5,0,.7,1) infinite alternate;
        }
        @keyframes iconglow {
          0% { filter: brightness(1.09) drop-shadow(0 0 0 #fff0);}
          100% { filter: brightness(1.22) drop-shadow(0 0 8px #fff6);}
        }
        @keyframes iconpulse {
          0% { transform: scale(1) }
          100% { transform: scale(1.13) }
        }
        @media (max-width: 900px) {
          .swiper-slide .group span.text-4xl {
            font-size: 30px !important;
          }
          .tech-carousel-bg {
            min-height: 170px;
          }
        }
        @media (max-width: 600px) {
          .swiper-slide .group span.text-4xl {
            font-size: 22px !important;
          }
          .tech-carousel-blur {
            filter: blur(19px) saturate(1.1);
          }
        }
      `}</style>
    </div>
  );
}