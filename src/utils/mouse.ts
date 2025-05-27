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
            // Só atualiza se realmente mudou
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
    }, [mousePosition]); // Dependendo do caso, pode-se usar [] para só adicionar uma vez. Se usar [], a closure vai capturar o valor antigo, então pode ser interessante usar um ref, mas nesse caso, para evitar update loop, é melhor [] e sempre setar novo valor.

    return mousePosition;
}