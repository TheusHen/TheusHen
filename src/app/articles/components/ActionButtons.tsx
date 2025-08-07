"use client";

import { Button } from "./ui/button";
import { Github, ExternalLink } from "lucide-react";

export const ActionButtons = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 rounded-lg shadow-md transition-all hover:shadow-lg flex items-center gap-2"
                size="lg"
            >
                <Github size={20} />
                Source Code
            </Button>

            <Button
                variant="secondary"
                className="font-semibold px-8 py-6 rounded-lg border border-border hover:bg-accent transition-all flex items-center gap-2"
                size="lg"
            >
                <ExternalLink size={20} />
                Use yourself
            </Button>
        </div>
    );
};

