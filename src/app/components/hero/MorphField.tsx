"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SHAPES, buildShape, scatterCloud } from "./shapes";

const vertexShader = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aRand;

uniform float uProgress;
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform vec2 uMouse;
uniform float uMouseForce;
uniform float uPulse;

varying float vRand;
varying float vEnergy;

vec3 flow(vec3 p, float t) {
    return vec3(
        sin(p.y * 1.3 + t) + cos(p.z * 1.7 - t * 0.7),
        sin(p.z * 1.1 + t * 0.8) + cos(p.x * 1.5 + t),
        sin(p.x * 1.2 - t * 0.6) + cos(p.y * 1.4 + t * 0.9)
    );
}

float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
    float delay = aRand * 0.45;
    float local = clamp((uProgress - delay) / 0.55, 0.0, 1.0);
    float eased = easeInOutCubic(local);
    float chaos = sin(local * 3.14159265);

    vec3 pos = mix(aFrom, aTo, eased);
    vec3 turbulence = flow(pos * 0.55 + aRand * 12.0, uTime * 0.9);
    pos += turbulence * chaos * (0.7 + aRand * 1.6);
    pos += flow(pos * 0.9 + aRand, uTime * 0.35 + aRand * 6.2831) * 0.03;

    vec4 world = modelMatrix * vec4(pos, 1.0);

    vec2 diff = world.xy - uMouse;
    float dist = length(diff);
    float radius = 1.6;
    float force = smoothstep(radius, 0.0, dist) * uMouseForce;
    world.xy += normalize(diff + 0.0001) * force * (0.9 + aRand * 0.8);
    world.z += force * 1.4;

    float ripple = sin(dist * 3.0 - uPulse * 14.0) * exp(-uPulse * 2.2) * step(0.001, uPulse);
    world.z += ripple * 0.6 * smoothstep(6.0, 0.0, dist);

    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;

    vEnergy = clamp(force * 1.4 + chaos * 0.9 + abs(ripple) * 0.6, 0.0, 1.0);
    vRand = aRand;

    float size = uSize * (0.55 + aRand * 0.9) * (1.0 + vEnergy * 0.7);
    gl_PointSize = size * uPixelRatio * (10.0 / -mvPosition.z);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorBase;
uniform vec3 uColorSignal;

varying float vRand;
varying float vEnergy;

void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = pow(smoothstep(0.5, 0.0, d), 1.7);

    float signal = clamp(step(0.9, vRand) + vEnergy * 0.95, 0.0, 1.0);
    vec3 color = mix(uColorBase, uColorSignal, signal);
    gl_FragColor = vec4(color, alpha * (0.5 + vEnergy * 0.5));
}
`;

type MorphFieldProps = {
    shapeIndex: number;
    reducedMotion: boolean;
    className?: string;
};

export default function MorphField({ shapeIndex, reducedMotion, className }: MorphFieldProps) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const requestShapeRef = useRef<(index: number) => void>(() => {});
    const initialIndex = useRef(shapeIndex);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        } catch {
            return;
        }

        const isSmall = window.innerWidth < 768;
        const count = isSmall ? 7000 : 15000;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        renderer.setPixelRatio(pixelRatio);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 10);

        const geometry = new THREE.BufferGeometry();
        const from = scatterCloud(count, 14);
        const to = scatterCloud(count, 14);
        const rand = new Float32Array(count);
        for (let i = 0; i < count; i++) rand[i] = Math.random();

        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        const fromAttr = new THREE.BufferAttribute(from, 3);
        const toAttr = new THREE.BufferAttribute(to, 3);
        geometry.setAttribute("aFrom", fromAttr);
        geometry.setAttribute("aTo", toAttr);
        geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);

        const uniforms = {
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uPixelRatio: { value: pixelRatio },
            uSize: { value: isSmall ? 3.4 : 3.8 },
            uMouse: { value: new THREE.Vector2(999, 999) },
            uMouseForce: { value: 0 },
            uPulse: { value: 0 },
            uColorBase: { value: new THREE.Color("#e8e8ea") },
            uColorSignal: { value: new THREE.Color("#ff3b3b") },
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const bounds = { width: 10, height: 6 };
        const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-grotesk").trim() || "sans-serif";
        let currentIndex = initialIndex.current;
        let pendingIndex: number | null = null;
        let animating = false;
        const duration = reducedMotion ? 0.001 : 2.4;

        const measure = () => {
            const w = mount.clientWidth || window.innerWidth;
            const h = mount.clientHeight || window.innerHeight;
            renderer.setSize(w, h, false);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            const visibleHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            bounds.height = visibleHeight;
            bounds.width = visibleHeight * camera.aspect;
        };

        const startMorph = (index: number) => {
            const target = buildShape(SHAPES[index].id, count, bounds, fontFamily);
            toAttr.array.set(target);
            toAttr.needsUpdate = true;
            uniforms.uProgress.value = 0;
            currentIndex = index;
            animating = true;
        };

        const commit = () => {
            fromAttr.array.set(toAttr.array as Float32Array);
            fromAttr.needsUpdate = true;
            uniforms.uProgress.value = 0;
            animating = false;
            if (pendingIndex !== null && pendingIndex !== currentIndex) {
                const next = pendingIndex;
                pendingIndex = null;
                startMorph(next);
            }
        };

        requestShapeRef.current = (index: number) => {
            if (index === currentIndex && !animating) return;
            if (animating) {
                pendingIndex = index;
                return;
            }
            startMorph(index);
        };

        measure();
        let started = false;
        document.fonts.ready.then(() => {
            if (started) return;
            started = true;
            startMorph(currentIndex);
        });

        let resizeTimer: ReturnType<typeof setTimeout> | undefined;
        const onResize = () => {
            measure();
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const snapped = buildShape(SHAPES[currentIndex].id, count, bounds, fontFamily);
                fromAttr.array.set(snapped);
                toAttr.array.set(snapped);
                fromAttr.needsUpdate = true;
                toAttr.needsUpdate = true;
                uniforms.uProgress.value = 0;
                animating = false;
            }, 250);
        };
        window.addEventListener("resize", onResize);

        const pointer = new THREE.Vector2(0, 0);
        const pointerWorld = new THREE.Vector2(999, 999);
        let pointerActive = false;
        const ndc = new THREE.Vector3();

        const onPointerMove = (e: PointerEvent) => {
            const rect = mount.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            ndc.set(pointer.x, pointer.y, 0.5).unproject(camera);
            const dir = ndc.sub(camera.position).normalize();
            const t = -camera.position.z / dir.z;
            pointerWorld.set(camera.position.x + dir.x * t, camera.position.y + dir.y * t);
            pointerActive = e.clientY >= rect.top && e.clientY <= rect.bottom;
        };
        const onPointerLeave = () => {
            pointerActive = false;
        };
        const onPointerDown = () => {
            uniforms.uPulse.value = 0.0001;
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        mount.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("pointerdown", onPointerDown, { passive: true });

        let visible = true;
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
        });
        observer.observe(mount);

        const clock = new THREE.Clock();
        let frame = 0;
        const tick = () => {
            frame = requestAnimationFrame(tick);
            const dt = Math.min(clock.getDelta(), 0.05);
            if (!visible || document.hidden) return;

            uniforms.uTime.value += dt;

            if (animating) {
                uniforms.uProgress.value = Math.min(uniforms.uProgress.value + dt / duration, 1);
                if (uniforms.uProgress.value >= 1) commit();
            }

            if (uniforms.uPulse.value > 0) {
                uniforms.uPulse.value += dt;
                if (uniforms.uPulse.value > 2.5) uniforms.uPulse.value = 0;
            }

            const targetForce = pointerActive && !reducedMotion ? 1 : 0;
            uniforms.uMouseForce.value += (targetForce - uniforms.uMouseForce.value) * 0.08;
            (uniforms.uMouse.value as THREE.Vector2).lerp(pointerWorld, 0.18);

            const t = uniforms.uTime.value;
            const idle = reducedMotion ? 0 : 1;
            points.rotation.y += (Math.sin(t * 0.18) * 0.28 * idle + pointer.x * 0.22 - points.rotation.y) * 0.04;
            points.rotation.x += (Math.cos(t * 0.13) * 0.08 * idle - pointer.y * 0.14 - points.rotation.x) * 0.04;

            renderer.render(scene, camera);
        };
        tick();

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(resizeTimer);
            observer.disconnect();
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", onPointerDown);
            mount.removeEventListener("pointerleave", onPointerLeave);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.domElement.remove();
            requestShapeRef.current = () => {};
        };
    }, [reducedMotion]);

    useEffect(() => {
        requestShapeRef.current(shapeIndex);
    }, [shapeIndex]);

    return <div ref={mountRef} className={className} aria-hidden="true" />;
}
