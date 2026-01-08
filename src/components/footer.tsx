import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className } ) => {
  return (
    <footer className={`flex w-full p-4 text-black bg-white justify-around text-3xl ${className || ""}`}>
        <Link href="/"><FaHome /></Link>
        <Link href="/community"><FaPeopleGroup /></Link>
        <Link href="/profile"><IoIosPerson /></Link>
    </footer>
  );
}
