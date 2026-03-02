"use client";

import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ReadOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
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
      key: "/question",
      icon: <QuestionCircleOutlined />,
      label: "Question",
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
    <aside className="fixed left-10 top-20 py-8 h-[calc(100vh-5rem)] w-64 glass !border-0 backdrop-blur-xl z-10 pb-6 px-5 overflow-y-auto">
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
