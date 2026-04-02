"use client";

import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide sidebar on landing page
  if (pathname === "/") {
    return null;
  }

  const menuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "/feed",
      icon: <ReadOutlined />,
      label: "My Feed",
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "Users",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <aside className="fixed  top-20 py-8 h-[calc(100vh-5rem)] w-64 bg-surface z-10 pb-6 px-5 overflow-y-auto">
      <Menu
        mode="vertical"
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        className="!bg-transparent !border-none sidebar-menu"
        items={menuItems}
        theme="dark"
      />
    </aside>
  );
}
