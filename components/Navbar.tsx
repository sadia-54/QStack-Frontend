"use client";

import { useState } from "react";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logoutUser } from "@/store/auth/authThunks";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isLandingPage = pathname === "/";

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
     <div className="h-20 bg-surface border-0 backdrop-blur-xl rounded mx-auto max-w-[100%] px-16 pl-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center ml-5 ">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer select-none"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-[#e6edf3] via-[#9da7b3] to-[#4f8cff] bg-clip-text text-transparent transition-all duration-300 hover:brightness-110">
              QStack
            </span>
          </div>
        </div>

        {/* Links */}
        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-8 text-base text-text-secondary/90">
            <a className="hover:text-text-primary transition" href="#features">Features</a>
            <a className="hover:text-text-primary transition" href="#how">How It Works</a>
            <a className="hover:text-text-primary transition" href="#community">Community</a>
          </nav>
        )}

        {/* CTA */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Button
              className="!bg-surface !text-text-primary !border border-soft hover:!border-accent"
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
