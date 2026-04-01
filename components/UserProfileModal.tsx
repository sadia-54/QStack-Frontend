"use client";

import { useEffect, useState } from "react";
import { Modal, Avatar, Tag, Spin, Descriptions, Empty } from "antd";
import { UserOutlined, ThunderboltOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { getUserProfile } from "@/api/user";
import { Profile } from "@/types/user";

interface UserProfileModalProps {
  open: boolean;
  userId: number | null;
  onClose: () => void;
}

export default function UserProfileModal({ open, userId, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetchProfile(userId);
    }
  }, [open, userId]);

  const fetchProfile = async (id: number) => {
    setLoading(true);
    try {
      const data = await getUserProfile(id);
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProfile(null);
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      className="glass-modal"
      width={600}
      title={null}
    >
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" />
          </div>
        ) : profile ? (
          <div className="flex flex-col items-center">
            {/* Avatar & Username */}
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="!bg-hover-bg !border-2 !border-primary/30 mb-4"
            />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              {profile.username}
            </h2>

            {/* Bio */}
            <div className="text-text-secondary text-center mb-6 max-w-md">
              {profile.bio || <span className="text-text-muted italic">No bio yet</span>}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <ThunderboltOutlined className="text-warning" />
                  <span className="text-sm">Reputation</span>
                </div>
                <span className="text-lg font-medium text-text-primary">
                  {profile.total_votes}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <MessageOutlined className="text-primary" />
                  <span className="text-sm">Questions</span>
                </div>
                <span className="text-lg font-medium text-text-primary">
                  {profile.total_questions}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <StarOutlined className="text-success" />
                  <span className="text-sm">Answers</span>
                </div>
                <span className="text-lg font-medium text-text-primary">
                  {profile.total_answers}
                </span>
              </div>
            </div>

            {/* Preferred Tags */}
            {profile.preferred_tags && profile.preferred_tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-text-muted mb-2 text-center">Preferred Tags</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.preferred_tags.map((tag, index) => (
                    <Tag
                      key={index}
                      className="!bg-hover-bg !border-border-soft !text-text-secondary"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="w-full border-t border-border-soft pt-4 mt-2">
              <Descriptions
                column={1}
                size="small"
                labelStyle={{ color: "var(--color-text-muted)" }}
                contentStyle={{ color: "var(--color-text-secondary)" }}
              >
                <Descriptions.Item label="Member since">
                  {formatDate(profile.created_at)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Empty description="User profile not found" />
          </div>
        )}
      </div>
    </Modal>
  );
}
