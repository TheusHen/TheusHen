import { useEffect, useState } from "react";

interface MousePosition {
    x: number;
    y: number;
}

export function useMousePosition(): MousePosition {
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const newPosition = { x: event.clientX, y: event.clientY };
            if (
                newPosition.x !== mousePosition.x ||
                newPosition.y !== mousePosition.y
            ) {
                setMousePosition(newPosition);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mousePosition]);

    return mousePosition;
}
