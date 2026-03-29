"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Tag, Avatar, Modal, Input, Space, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { RootState, AppDispatch } from "@/store";
import AuthGuard from "@/components/AuthGuard";
import { fetchProfile, updateUserProfile } from "@/store/user/userThunks";
import { Profile as ProfileType } from "@/types/user";

const { TextArea } = Input;

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUserId } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, error } = useSelector((state: RootState) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchProfile(currentUserId));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (profile?.bio) {
      setBio(profile.bio);
    }
  }, [profile?.bio]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(bio));
      message.success("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      message.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile?.bio) {
      setBio(profile.bio);
    }
    setIsEditModalOpen(false);
  };

  if (isLoading && !profile) {
    return (
      <AuthGuard>
        <div className="relative starry min-h-screen px-4 py-6">
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted">Loading profile...</p>
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
          {/* Profile Header */}
          <Card className="bg-surface !rounded-2xl !text-white hover:!border-accent transition mb-6">
            <div className="flex items-center gap-6">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="!bg-hover-bg !border-2 !border-primary/30"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-text-primary">
                  {profile?.username || "User"}
                </h1>
                <p className="text-sm text-text-muted flex items-center gap-2 mt-1">
                  <MailOutlined />
                  {profile?.username ? `${profile.username}@qstack.com` : "user@example.com"}
                </p>
                {profile?.bio && (
                  <p className="text-sm text-text-secondary mt-2">{profile.bio}</p>
                )}
              </div>
              <Button
                className="btn-gradient"
                icon={<EditOutlined />}
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card
              className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center text-warning mb-3">
                  <StarOutlined className="text-2xl" />
                </div>
                <div className="text-3xl font-semibold text-text-primary">
                  {profile?.total_votes || 0}
                </div>
                <div className="text-sm text-text-muted mt-1">Reputation</div>
              </div>
            </Card>

            <Card
              className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center text-primary mb-3">
                  <ThunderboltOutlined className="text-2xl" />
                </div>
                <div className="text-3xl font-semibold text-text-primary">
                  {profile?.total_questions || 0}
                </div>
                <div className="text-sm text-text-muted mt-1">Questions</div>
              </div>
            </Card>

            <Card
              className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center text-success mb-3">
                  <MessageOutlined className="text-2xl" />
                </div>
                <div className="text-3xl font-semibold text-text-primary">
                  {profile?.total_answers || 0}
                </div>
                <div className="text-sm text-text-muted mt-1">Answers</div>
              </div>
            </Card>

            {/* Preferred Tags */}
            <Card className="bg-surface !rounded-2xl !text-white hover:!border-primary transition">
              <h3 className="text-lg font-semibold mb-4 text-text-primary">Preferred Tags</h3>
              {profile?.preferred_tags && profile.preferred_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_tags.map((tag) => (
                    <Tag
                      key={tag}
                      className="!bg-hover-bg !border-border-soft !text-text-secondary"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No preferred tags set</p>
              )}
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          title="Edit Profile"
          open={isEditModalOpen}
          onOk={handleSave}
          onCancel={handleCancel}
          className="glass-modal"
          footer={[
            <Button key="cancel" onClick={handleCancel} className="!text-text-secondary">
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSave}
              className="btn-gradient"
              loading={isLoading}
            >
              Save Changes
            </Button>,
          ]}
        >
          <Space direction="vertical" className="w-full mt-4">
            <div>
              <label className="text-text-secondary text-sm mb-2 block">Bio</label>
              <TextArea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="!bg-surface !text-text-primary !border hover:!border-accent focus:!border-accent"
                placeholder="Tell us about yourself..."
              />
            </div>
          </Space>
        </Modal>
      </div>
    </AuthGuard>
  );
}
