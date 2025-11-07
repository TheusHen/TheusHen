"use client";

import React, { Suspense } from "react";
import LoadingDots from "./LoadingDots";

const GlobeBrazil = React.lazy(() => import("./Globe"));

const LazyGlobe = () => (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><LoadingDots color="#fff" /></div>}>
        <GlobeBrazil />
    </Suspense>
);

export default LazyGlobe;
