import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

export const buttonVariants = ({
    variant = "primary",
    size = "md",
    className = ""
}: {
    variant?: ButtonProps["variant"],
    size?: ButtonProps["size"],
    className?: string
}) => {
    const variants = {
        primary: "bg-primary text-primary-foreground border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        secondary: "bg-secondary text-secondary-foreground border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        accent: "bg-accent text-accent-foreground border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        outline: "bg-white border-2 border-black text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        ghost: "hover:bg-muted text-foreground border-2 border-transparent hover:border-black",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-12 w-12 p-0 flex items-center justify-center",
    };

    return cn(
        "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
    );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={buttonVariants({ variant, size, className })}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
