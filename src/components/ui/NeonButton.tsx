"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'pink' | 'cyan' | 'purple' | 'green';
    glow?: boolean;
    href?: string;
}

export const NeonButton = ({
    children,
    className,
    variant = 'pink',
    glow = true,
    href,
    ...props
}: NeonButtonProps) => {
    const variants = {
        pink: "border-neon-pink text-neon-pink hover:bg-neon-pink/10 shadow-[0_0_10px_rgba(255,0,127,0.3)] hover:shadow-[0_0_20px_rgba(255,0,127,0.6)]",
        cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]",
        purple: "border-neon-purple text-neon-purple hover:bg-neon-purple/10 shadow-[0_0_10px_rgba(188,19,254,0.3)] hover:shadow-[0_0_20px_rgba(188,19,254,0.6)]",
        green: "border-neon-green text-neon-green hover:bg-neon-green/10 shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.6)]",
    };

    const buttonContent = (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-3 rounded-full border-2 font-bold uppercase tracking-wider transition-all duration-300",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );

    if (href && !props.disabled) {
        return (
            <Link href={href} className="contents">
                {buttonContent}
            </Link>
        );
    }

    return buttonContent;
};
