"use client";

import { GitBranch, GitCommit, GitPullRequest, Bug, GitFork, Copy } from "lucide-react";

const FlowNode = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card border border-border rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition-all hover:shadow-md ${className}`}>
        {children}
    </div>
);

const FlowArrow = ({ direction = "down" }: { direction?: "down" | "side" }) => (
    <div className={`flex items-center justify-center ${direction === "down" ? "h-8" : "w-8"}`}>
        <div className={`bg-flow-line ${direction === "down" ? "w-0.5 h-6" : "h-0.5 w-6"}`}></div>
        <div className={`absolute ${direction === "down" ? "border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-flow-line" : "border-t-2 border-b-2 border-r-4 border-t-transparent border-b-transparent border-r-flow-line"} w-0 h-0`}></div>
    </div>
);

export const FlowDiagram = () => {
    return (
        <div className="bg-diagram-bg rounded-xl p-8 max-w-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
                TheusHenr <em className="text-muted-foreground">Backup</em>
            </h2>

            {/* Flow diagram */}
            <div className="flex flex-col items-center space-y-4">
                {/* Automation */}
                <FlowNode>Automation</FlowNode>
                <FlowArrow />

                {/* GitHub Token */}
                <FlowNode>GitHubToken</FlowNode>
                <FlowArrow />

                {/* TheusHenr */}
                <FlowNode className="bg-primary text-primary-foreground">TheusHenr</FlowNode>

                {/* Branching section */}
                <div className="flex items-center justify-center w-full">
                    <div className="grid grid-cols-3 gap-8 items-center w-full max-w-4xl">
                        {/* Left column */}
                        <div className="flex flex-col items-center space-y-4">
                            <FlowNode className="flex items-center gap-2">
                                <GitPullRequest size={16} />
                                PullRequest
                            </FlowNode>
                            <FlowNode className="flex items-center gap-2">
                                <GitCommit size={16} />
                                Commit
                            </FlowNode>
                        </div>

                        {/* Center column */}
                        <div className="flex flex-col items-center space-y-4">
                            <FlowNode className="flex items-center gap-2">
                                <GitBranch size={16} />
                                Push
                            </FlowNode>
                            <FlowNode className="flex items-center gap-2">
                                <Bug size={16} />
                                Issue
                            </FlowNode>
                        </div>

                        {/* Right column */}
                        <div className="flex flex-col items-center space-y-4">
                            <FlowNode className="flex items-center gap-2">
                                <GitFork size={16} />
                                Fork
                            </FlowNode>
                            <FlowNode className="flex items-center gap-2">
                                <Copy size={16} />
                                Clone
                            </FlowNode>
                        </div>
                    </div>
                </div>

                {/* Converging lines to Repository */}
                <div className="h-12 flex items-center">
                    <FlowArrow />
                </div>

                {/* Repository */}
                <FlowNode className="bg-secondary">Repository</FlowNode>
            </div>
        </div>
    );
};
