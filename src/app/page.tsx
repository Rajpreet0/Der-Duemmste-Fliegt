"use client";
import Image from "next/image";
import Logo from "../../public/images/Logo.png";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center  ">

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <Image
          src={Logo}
          alt="Logo"
          height={200}
          width={200}
          unoptimized
          priority
        />
      </div>
      
      <div>
        <div 
        onClick={() => router.push("/setup")}
        className="bg-yellow p-4 rounded-lg text-white flex items-center gap-4 cursor-pointer hover:scale-105 hover:shadow-xl transition-all shadow-lg">
          <Play fill="white" className="rounded-full -rotate-12"/>
          <p className="text-xl">Start Game</p>
        </div>
      </div>
    </div>
  );
}
