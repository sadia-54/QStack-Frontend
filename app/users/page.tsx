"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Tag, Input, Select } from "antd";
import { UserOutlined, SearchOutlined, ThunderboltOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { getCommunityMembers } from "@/api/user";
import { UserSummaryPublic } from "@/types/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AuthGuard from "@/components/AuthGuard";
import UserProfileModal from "@/components/UserProfileModal";

const { Option } = Select;

export default function Users() {
  const [users, setUsers] = useState<UserSummaryPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const data = await getCommunityMembers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch community members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="relative starry min-h-screen px-4 py-6">
          <div className="glow -top-60 -left-60 bg-accent/20" />
          <div className="glow -bottom-60 -right-60 bg-accent/10" />
          <div className="relative z-10 mx-auto max-w-[1200px] flex items-center justify-center min-h-[60vh]">
            <div className="text-text-muted text-lg">Loading users...</div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-accent/20" />
        <div className="glow -bottom-60 -right-60 bg-accent/10" />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="bg-surface !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 mb-8">
            <h1 className="text-2xl font-semibold text-text-primary">Community Members</h1>
            <p className="text-meta text-text-muted mt-1">
              Connect with {users.length} developers from around the world
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search by username..."
              prefix={<SearchOutlined className="text-primary" />}
              size="large"
              className="!bg-surface !border hover:!border-accent focus:!border-accent placeholder:text-text-muted flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              size="large"
              className="!w-[200px]"
              popupClassName="!bg-surface-elevated !border"
            >
              <Option value="newest" className="!text-text-primary">Newest</Option>
              <Option value="oldest" className="!text-text-primary">Oldest</Option>
            </Select>
          </div>

          {/* Users Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {sortedUsers.map((user) => (
              <Card
                key={user.id}
                className="bg-surface !rounded-2xl !text-white hover:!border-accent transition cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex gap-4">
                  <Avatar
                    size={56}
                    icon={<UserOutlined />}
                    className="!bg-hover-bg !border-2 !border-primary/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-title text-text-primary hover:text-primary transition truncate">
                      {user.username}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 text-meta text-text-muted">
                      <div className="flex items-center gap-1">
                        <ThunderboltOutlined className="text-warning" />
                        <span>{user.total_votes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageOutlined className="text-primary" />
                        <span>{user.total_questions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarOutlined className="text-success" />
                        <span>{user.total_answers}</span>
                      </div>
                    </div>

                    <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary mt-2">
                      Member
                    </Tag>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedUsers.length === 0 && (
            <div className="bg-surface !rounded-2xl !text-white p-8 text-center">
              <div className="text-text-muted text-base">
                {searchTerm ? "No users match your search" : "No users yet"}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Modal */}
        <UserProfileModal
          open={isModalOpen}
          userId={selectedUserId}
          onClose={handleCloseModal}
        />
      </div>
    </AuthGuard>
  );
}
