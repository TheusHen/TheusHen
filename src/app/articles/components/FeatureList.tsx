"use client";

import { Check } from "lucide-react";

const features = [
    "Automated Version Control",
    "Smart Pull Requests",
    "Continuous Fork & Clone",
    "Secure GitHub Integration",
    "Synchronized Repositories",
    "CI/CD & DevOps Ready"
];

export const FeatureList = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold animate-fade-in">What's Included</h3>

            <div className="space-y-3">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 animate-fade-in hover-scale"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <Check className="w-5 h-5 text-primary flex-shrink-0 animate-scale-in" />
                        <span className="text-muted-foreground">{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};