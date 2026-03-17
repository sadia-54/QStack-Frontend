"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Tag, Input, Select } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { getUsers } from "@/api/user";
import { User } from "@/types/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AuthGuard from "@/components/AuthGuard";

const { Option } = Select;

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (id: number) => {
    router.push(`/profile/${id}`);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="relative starry min-h-screen px-4 py-6">
          <div className="glow -top-60 -left-60 bg-purple-900/40" />
          <div className="glow -bottom-60 -right-60 bg-blue-900/40" />
          <div className="relative z-10 mx-auto max-w-[1200px] flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-200/60 text-lg">Loading users...</div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-purple-900/40" />
        <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="glass !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 mb-8">
            <h1 className="text-2xl font-semibold text-white">Community Members</h1>
            <p className="text-sm text-gray-200/60 mt-1">
              Connect with developers from around the world
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search by username..."
              prefix={<SearchOutlined className="text-purple-300" />}
              size="large"
              className="!bg-white/5 !border-purple-400/20 !text-white placeholder:text-gray-200/40 flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              size="large"
              className="!w-[200px]"
              dropdownClassName="!bg-[#0b1026] !border-purple-400/20"
            >
              <Option value="newest" className="!text-white">Newest</Option>
              <Option value="oldest" className="!text-white">Oldest</Option>
            </Select>
          </div>

          {/* Users Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedUsers.map((user) => (
              <Card
                key={user.id}
                className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex flex-col items-center text-center p-4">
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    className="!bg-purple-500/20 !border-2 !border-purple-400/30 mb-4"
                  />
                  <h3 className="text-lg font-medium text-purple-200 hover:text-white transition">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-200/60 mt-1">
                    {user.email}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-200/60">
                    <div className="flex items-center gap-1">
                      <ThunderboltOutlined className="text-yellow-400" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageOutlined className="text-blue-400" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarOutlined className="text-green-400" />
                      <span>0</span>
                    </div>
                  </div>

                  <Tag className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200 mt-4">
                    Member
                  </Tag>
                </div>
              </Card>
            ))}
          </div>

          {sortedUsers.length === 0 && (
            <div className="glass !rounded-2xl !text-white p-8 text-center">
              <div className="text-gray-200/60 text-lg">
                {searchTerm ? "No users match your search" : "No users yet"}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
