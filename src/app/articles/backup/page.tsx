"use client";

import React from "react";
import { ActionButtons } from "../components/ActionButtons";
import { FeatureList } from "../components/FeatureList";
import { FlowDiagram } from "../components/FlowDiagram";

const Index = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-diagram-bg">
            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                    {/* Left side - Flow Diagram */}
                    <div className="flex justify-center">
                        <FlowDiagram />
                    </div>

                    {/* Right side - Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                                Automate and Manage with Backup
                            </h1>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Explore core automation features designed for developers and technical teams,
                                focusing on version control, traceability, and productivity.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold">Automated Account</h2>
                                <div className="space-y-3 text-muted-foreground">
                                    <p>• <em>TheusHenr</em> is the automation account used by TheusHen.</p>
                                    <p>• It handles commits, pull requests, forks, clones, and more—securely and efficiently.</p>
                                </div>
                            </div>

                            <FeatureList />

                            <ActionButtons />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
