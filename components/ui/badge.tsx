import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "outline" | "secondary" | "accent";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-primary text-black border-2 border-black",
        outline: "bg-white text-black border-2 border-black",
        secondary: "bg-secondary text-black border-2 border-black",
        accent: "bg-accent text-black border-2 border-black",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}
