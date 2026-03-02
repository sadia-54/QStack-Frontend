"use client";

import { useSelector } from "react-redux";
import { Card, Button, Tag, Avatar } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  EditOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { RootState } from "@/store";
import AuthGuard from "@/components/AuthGuard";

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <AuthGuard>
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-purple-900/40" />
        <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Profile Header */}
          <Card className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition mb-6">
            <div className="flex items-center gap-6">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="!bg-purple-500/20 !border-2 !border-purple-400/30"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">
                  {user?.username || "User"}
                </h1>
                <p className="text-sm text-gray-200/60 flex items-center gap-2 mt-1">
                  <MailOutlined />
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-sm text-gray-200/60 flex items-center gap-2 mt-1">
                  <CalendarOutlined />
                  Joined {new Date().toLocaleDateString()}
                </p>
              </div>
              <Button
                className="btn-gradient"
                icon={<EditOutlined />}
              >
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Stats & Info */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              {[
                { title: "Reputation", value: "0", icon: StarOutlined, color: "text-yellow-400" },
                { title: "Questions", value: "0", icon: ThunderboltOutlined, color: "text-blue-400" },
                { title: "Answers", value: "0", icon: MessageOutlined, color: "text-green-400" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.title}
                    className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition"
                  >
                    <div className="flex flex-col items-center text-center p-4">
                      <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} mb-3`}>
                        <Icon className="text-2xl" />
                      </div>
                      <div className="text-3xl font-semibold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-200/60 mt-1">{stat.title}</div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Badges */}
            <Card className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition">
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Tag className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200">
                  Newcomer
                </Tag>
                <Tag className="!bg-blue-500/10 !border-blue-400/20 !text-blue-200">
                  Learner
                </Tag>
              </div>
              <p className="text-sm text-gray-200/60 mt-4">
                Earn badges by participating in the community
              </p>
            </Card>
          </div>

          {/* Activity Section */}
          <Card className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition mt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-200/60">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start asking questions or answering to see your activity here</p>
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
