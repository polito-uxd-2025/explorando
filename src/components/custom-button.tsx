"use client";

import Link from 'next/link';
import { motion } from 'motion/react';

export const Button = ({ className, children, href }: { className?: string, children: React.ReactNode, href?: string }) => {
    return (
        <Link href={href || "#"} className={className || ""}>
            <motion.button 
                className={`flex flex-row items-center gap-2 bg-accent-500 p-3 rounded-4xl justify-center w-full text-white`}
                whileTap={{backgroundColor: "var(--accent-600)"}}
            >
                {children}
            </motion.button>
        </Link>);
};