"use client";

import { Button } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="relative z-10">
     <div className="h-20 glass !border-0 backdrop-blur-xl rounded mx-auto max-w-[100%] px-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
        <Image
            src="/logo.png"
            alt="QStack Logo"
            width={200}
            height={80}
            className="h-full w-auto object-contain"
            priority
        />
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-base text-gray-200/90">
          <a className="hover:text-white transition" href="#features">Features</a>
          <a className="hover:text-white transition" href="#how">How It Works</a>
          <a className="hover:text-white transition" href="#community">Community</a>
        </nav>

        {/* CTA */}
        <Button className="btn-gradient" type="primary">
          Get Started
        </Button>
      </div>
    </header>
  );
}