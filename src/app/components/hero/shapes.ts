export const SHAPES = [
    { id: "name", label: "IDENTITY" },
    { id: "globe", label: "GLOBE" },
    { id: "code", label: "SOURCE" },
    { id: "helix", label: "HELIX" },
    { id: "galaxy", label: "GALAXY" },
    { id: "knot", label: "TOPOLOGY" },
] as const;

export type ShapeId = (typeof SHAPES)[number]["id"];

type Bounds = { width: number; height: number };

function sampleText(text: string, count: number, targetWidth: number, fontFamily: string, weight = 700) {
    const out = new Float32Array(count * 3);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return out;

    const fontSize = 220;
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    const measured = Math.ceil(ctx.measureText(text).width);
    canvas.width = measured + 40;
    canvas.height = Math.ceil(fontSize * 1.3);
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hits: number[] = [];
    for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
            if (data[(y * width + x) * 4 + 3] > 140) hits.push(x, y);
        }
    }
    if (!hits.length) return out;

    const scale = targetWidth / width;
    const pairs = hits.length / 2;
    for (let i = 0; i < count; i++) {
        const k = Math.floor(Math.random() * pairs) * 2;
        out[i * 3] = (hits[k] - width / 2 + (Math.random() - 0.5) * 2) * scale;
        out[i * 3 + 1] = -(hits[k + 1] - height / 2 + (Math.random() - 0.5) * 2) * scale;
        out[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    }
    return out;
}

function globe(count: number, radius: number) {
    const out = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const ringShare = Math.floor(count * 0.25);
    const surface = count - ringShare;
    for (let i = 0; i < surface; i++) {
        const y = 1 - (i / (surface - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const jitter = 1 + (Math.random() - 0.5) * 0.02;
        out[i * 3] = Math.cos(theta) * r * radius * jitter;
        out[i * 3 + 1] = y * radius * jitter;
        out[i * 3 + 2] = Math.sin(theta) * r * radius * jitter;
    }
    const tilt = 0.42;
    for (let i = surface; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const rr = radius * (1.45 + Math.random() * 0.35);
        const x = Math.cos(a) * rr;
        const z = Math.sin(a) * rr;
        const y = (Math.random() - 0.5) * 0.04;
        out[i * 3] = x;
        out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
        out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
    }
    return out;
}

function helix(count: number, length: number, radius: number) {
    const out = new Float32Array(count * 3);
    const turns = 3.2;
    for (let i = 0; i < count; i++) {
        const isRung = Math.random() < 0.18;
        const t = Math.random();
        const angle = t * Math.PI * 2 * turns;
        const x = (t - 0.5) * length;
        if (isRung) {
            const rungT = Math.round(t * 36) / 36;
            const ra = rungT * Math.PI * 2 * turns;
            const s = Math.random() * 2 - 1;
            out[i * 3] = (rungT - 0.5) * length;
            out[i * 3 + 1] = Math.cos(ra) * radius * s;
            out[i * 3 + 2] = Math.sin(ra) * radius * s;
        } else {
            const strand = Math.random() < 0.5 ? 0 : Math.PI;
            const spread = (Math.random() - 0.5) * 0.12;
            out[i * 3] = x;
            out[i * 3 + 1] = Math.cos(angle + strand) * (radius + spread);
            out[i * 3 + 2] = Math.sin(angle + strand) * (radius + spread);
        }
    }
    return out;
}

function galaxy(count: number, radius: number) {
    const out = new Float32Array(count * 3);
    const arms = 3;
    const tilt = 1.05;
    for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 0.7) * radius;
        const arm = (i % arms) * ((Math.PI * 2) / arms);
        const spin = r * 1.25;
        const scatter = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6 * (1 - r / radius + 0.3);
        const angle = arm + spin + scatter;
        const x = Math.cos(angle) * r + (Math.random() - 0.5) * 0.25;
        const z = Math.sin(angle) * r + (Math.random() - 0.5) * 0.25;
        const y = (Math.random() - 0.5) * 0.3 * (1 - r / radius);
        out[i * 3] = x;
        out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
        out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
    }
    return out;
}

function torusKnot(count: number, scale: number) {
    const out = new Float32Array(count * 3);
    const p = 2;
    const q = 3;
    for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = 2 + Math.cos(q * t);
        const cx = r * Math.cos(p * t);
        const cy = r * Math.sin(p * t);
        const cz = Math.sin(q * t);
        const u = Math.random() * Math.PI * 2;
        const tube = 0.32 * Math.sqrt(Math.random());
        out[i * 3] = (cx + Math.cos(u) * tube) * scale;
        out[i * 3 + 1] = (cy + Math.sin(u) * tube) * scale;
        out[i * 3 + 2] = (cz + Math.cos(u + 1.3) * tube) * scale;
    }
    return out;
}

export function scatterCloud(count: number, radius: number) {
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random() * 2 - 1;
        const a = Math.random() * Math.PI * 2;
        const r = radius * Math.cbrt(Math.random());
        const s = Math.sqrt(1 - u * u);
        out[i * 3] = Math.cos(a) * s * r;
        out[i * 3 + 1] = u * r;
        out[i * 3 + 2] = Math.sin(a) * s * r;
    }
    return out;
}

export function buildShape(id: ShapeId, count: number, bounds: Bounds, fontFamily: string) {
    const fit = Math.min(bounds.width, bounds.height * 1.6);
    switch (id) {
        case "name":
            return sampleText("TheusHen", count, Math.min(bounds.width * 0.82, 11), fontFamily);
        case "code":
            return sampleText("</>", count, Math.min(bounds.width * 0.55, 6.2), fontFamily, 500);
        case "globe":
            return globe(count, Math.min(fit * 0.19, 2.6));
        case "helix":
            return helix(count, Math.min(bounds.width * 0.85, 11), Math.min(fit * 0.09, 1.15));
        case "galaxy":
            return galaxy(count, Math.min(fit * 0.36, 5));
        case "knot":
            return torusKnot(count, Math.min(fit * 0.075, 0.95));
    }
}
