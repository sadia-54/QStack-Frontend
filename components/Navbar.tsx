"use client";

import { useState } from "react";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/auth/authSlice";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

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
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Button
              className="!bg-white/5 !text-white !border-white/10 hover:!border-purple-400/30"
              icon={<UserOutlined />}
              onClick={handleDashboardClick}
            >
              Dashboard
            </Button>
            <Button
              className="btn-gradient"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            className="btn-gradient"
            type="primary"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Get Started
          </Button>
        )}

        <AuthModal
          open={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </header>
  );
}
