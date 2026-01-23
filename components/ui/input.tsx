import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full border-2 border-black bg-white px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
