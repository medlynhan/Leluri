'use client'
import Image from "next/image";
import { useState } from "react";
import { PiStudent } from "react-icons/pi";
import { GiStoneCrafting } from "react-icons/gi";
import { MdOutlineMuseum } from "react-icons/md"; 
import { GiDramaMasks } from "react-icons/gi";


interface CommunityMemberCardProps {
  username: string;
  role: "pelajar budaya" | "pengrajin" | "kolektor" | "sanggar seni";
  imageSrc: string;
}

export default function CommunityMemberCard({ username, role, imageSrc }: CommunityMemberCardProps) {
  const [isActive, setIsActive] = useState(false);

  const renderIcon = () => {
    switch (role) {
      case "pelajar budaya":
        return <PiStudent className="w-full h-full p-7 md:p-10 text-[var(--white)]" />;
      case "pengrajin":
        return <GiStoneCrafting className="w-full h-full p-7 md:p-10 text-[var(--white)]" />;
      case "kolektor":
        return <MdOutlineMuseum className="w-full h-full p-7 md:p-10 text-[var(--white)]" />;
      case "sanggar seni":
        return <GiDramaMasks className="w-full h-full p-7 md:p-10 text-[var(--white)]" />;
      default:
        return null;
    }
  };


  return (
    <div className="flex flex-col justify-center items-center  w-[10em]">
      <div className="relative cursor-pointer"   onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)} >
        <Image src={imageSrc} alt={username} width={100} height={100} className="rounded-full w-full h-full" />
        <div className={`w-full h-full bg-[var(--yellow)] absolute top-0 left-0 rounded-full ${isActive ? "opacity-90" : "opacity-0"} flex justify-center items-center`}>
          {renderIcon()}
        </div>
      </div>
      <p className="font-semibold">{username}</p>
      <p className="font-semibold text-[var(--yellow)]">{role}</p>
    </div>
  );
}
