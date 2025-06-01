"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { FeatureCollection, Geometry, Feature, GeoJsonProperties } from "geojson";
import type { Topology, Objects } from "topojson-specification";

const BRAZIL_ID = 76;

function getGlobeScale(width: number, height: number) {
    return Math.min(width, height) / 2.2;
}
function getGlobeRadius(width: number, height: number) {
    return Math.min(width, height) / 2.3;
}

// Função utilitária para detectar dispositivos móveis
function isMobileDevice() {
    if (typeof window === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

type GlobeBrazilProps = {
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
};

export const GlobeBrazil: React.FC<GlobeBrazilProps> = ({
                                                            width = 400,
                                                            height = 400,
                                                            className = "",
                                                            style = {},
                                                        }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

    useEffect(() => {
        if (isMobile) return;

        let animationFrame: number | null = null;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const defs = svg.append("defs");
        const oceanGradient = defs
            .append("radialGradient")
            .attr("id", "oceanGradient")
            .attr("cx", "50%")
            .attr("cy", "45%")
            .attr("r", "65%");
        oceanGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3fa0f7");
        oceanGradient.append("stop").attr("offset", "100%").attr("stop-color", "#174b89");

        const projection = d3
            .geoOrthographic()
            .scale(getGlobeScale(width, height))
            .translate([width / 2, height / 2])
            .rotate([45, -20]);
        const path: d3.GeoPath<d3.GeoPermissibleObjects> = d3.geoPath(projection);

        svg
            .append("circle")
            .attr("class", "ocean")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", getGlobeRadius(width, height));

        svg
            .append("ellipse")
            .attr("class", "shadow")
            .attr("cx", width / 2)
            .attr("cy", height / 2 + getGlobeRadius(width, height) * 0.77)
            .attr("rx", getGlobeRadius(width, height) * 0.6)
            .attr("ry", getGlobeRadius(width, height) * 0.19);

        const graticule = d3.geoGraticule10();
        const graticulePath = svg
            .append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path as unknown as string);

        d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then(
            (worldData) => {
                const world = worldData as Topology<Objects<GeoJsonProperties>>;
                const countriesFeatureCollection = topojson.feature(
                    world,
                    world.objects.countries
                ) as FeatureCollection<Geometry, GeoJsonProperties>;
                const countries = countriesFeatureCollection.features;

                const countryPaths = svg
                    .selectAll<SVGPathElement, Feature<Geometry, GeoJsonProperties>>("path.country")
                    .data(countries)
                    .join("path")
                    .attr("class", (d) =>
                        "country" +
                        ((d.id === BRAZIL_ID ||
                            d.id === "76" ||
                            d.id === 76 ||
                            d.properties?.name === "Brazil")
                            ? " brazil"
                            : "")
                    )
                    .attr("d", path as unknown as string)
                    .on("mouseover", function () {
                        if (!d3.select(this).classed("brazil")) {
                            d3.select(this).raise();
                        }
                    });

                countryPaths
                    .filter((d: Feature<Geometry, GeoJsonProperties>) =>
                        d.id === BRAZIL_ID ||
                        d.id === "76" ||
                        d.id === 76 ||
                        d.properties?.name === "Brazil"
                    )
                    .raise();

                const targetRotation = [...projection.rotate()] as [number, number, number?];
                const currentRotation = [...projection.rotate()] as [number, number, number?];

                let autoRotate = true;
                let dragging = false;

                function animate() {
                    if (!dragging && autoRotate) {
                        targetRotation[0] += 0.04;
                    }
                    currentRotation[0] += (targetRotation[0] - currentRotation[0]) * 0.14;
                    currentRotation[1] += (targetRotation[1] - currentRotation[1]) * 0.14;
                    currentRotation[1] = Math.max(Math.min(currentRotation[1], 90), -90);
                    projection.rotate([currentRotation[0], currentRotation[1]]);
                    graticulePath.attr("d", path as unknown as string);
                    countryPaths.attr("d", path as unknown as string);
                    animationFrame = requestAnimationFrame(animate);
                }
                animate();

                let lastPos: [number, number] | null = null;

                function dragStart(event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
                    dragging = true;
                    autoRotate = false;
                    const point = d3.pointer(event.sourceEvent, svg.node() as SVGSVGElement);
                    lastPos = [point[0], point[1]];
                }
                function dragMove(event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
                    if (!dragging || !lastPos) return;
                    const point = d3.pointer(event.sourceEvent, svg.node() as SVGSVGElement);
                    const dx = point[0] - lastPos[0];
                    const dy = point[1] - lastPos[1];
                    const sens = 0.3;
                    targetRotation[0] += dx * sens;
                    targetRotation[1] -= dy * sens;
                    targetRotation[1] = Math.max(Math.min(targetRotation[1], 90), -90);
                    lastPos = [point[0], point[1]];
                }
                function dragEnd() {
                    dragging = false;
                    setTimeout(() => {
                        autoRotate = true;
                    }, 1800);
                }
                if (svgRef.current) {
                    d3.select(svgRef.current)
                        .call(
                            d3
                                .drag<SVGSVGElement, unknown>()
                                .on("start", dragStart)
                                .on("drag", dragMove)
                                .on("end", dragEnd)
                        );
                }

                svg.on("wheel", function (event: WheelEvent) {
                    event.preventDefault();
                    let scale = projection.scale();
                    const delta = event.deltaY * -0.03;
                    scale += delta;
                    scale = Math.max(
                        80,
                        Math.min(scale, Math.min(width, height) / 2.2)
                    );
                    projection.scale(scale);
                    svg
                        .select("circle.ocean")
                        .attr("r", scale * 0.97);
                    graticulePath.attr("d", path as unknown as string);
                    countryPaths.attr("d", path as unknown as string);
                });
            }
        );

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [width, height, isMobile]);

    if (isMobile) return null;

    return (
        <div
            className={`mt-6 ${className}`}
            style={{
                width,
                height,
                overflow: "hidden",
                ...style,
            }}
        >
            <svg
                ref={svgRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
            <style>{`
        .country {
          fill: #8cb1e5;
          stroke: #1b2a40;
          stroke-width: 0.3;
          transition: fill 0.4s;
        }
        .country:hover {
          fill: #0055ff;
          cursor: pointer;
        }
        .country.brazil {
          fill: #00e676 !important;
          stroke: #14ff72 !important;
          stroke-width: 2 !important;
          filter: drop-shadow(0px 0px 5px #00e676);
        }
        .graticule {
          fill: none;
          stroke: rgba(68, 72, 81, 0.22);
          stroke-width: 0.7;
          opacity: 0.9;
        }
        .ocean {
          fill: url(#oceanGradient);
        }
        .shadow {
          fill: rgba(0,0,0,0.08);
          pointer-events: none;
        }
      `}</style>
        </div>
    );
};

export default GlobeBrazil;