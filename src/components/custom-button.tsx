import Link from 'next/link';

export const Button = ({ className, children, href }: { className?: string, children: React.ReactNode, href?: string }) => {
    return <Link href={href || "#"} className={className || ""}><button className={`flex flex-row items-center gap-2 bg-accent-500 p-3 rounded-4xl justify-center w-full`}>{children}</button></Link>;
};