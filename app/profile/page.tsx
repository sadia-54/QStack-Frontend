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
            <p className="text-white/60">Loading profile...</p>
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
                  {profile?.username || "User"}
                </h1>
                <p className="text-sm text-gray-200/60 flex items-center gap-2 mt-1">
                  <MailOutlined />
                  {profile?.username ? `${profile.username}@qstack.com` : "user@example.com"}
                </p>
                {profile?.bio && (
                  <p className="text-sm text-gray-200/80 mt-2">{profile.bio}</p>
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
              className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400 mb-3">
                  <StarOutlined className="text-2xl" />
                </div>
                <div className="text-3xl font-semibold text-white">
                  {profile?.total_votes || 0}
                </div>
                <div className="text-sm text-gray-200/60 mt-1">Reputation</div>
              </div>
            </Card>

            <Card
              className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 mb-3">
                  <ThunderboltOutlined className="text-2xl" />
                </div>
                <div className="text-3xl font-semibold text-white">
                  {profile?.total_questions || 0}
                </div>
                <div className="text-sm text-gray-200/60 mt-1">Questions</div>
              </div>
            </Card>

            <Card
              className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-green-400 mb-3">
                  <MessageOutlined className="text-2xl" />
                </div>
                <div className="text-3xl font-semibold text-white">
                  {profile?.total_answers || 0}
                </div>
                <div className="text-sm text-gray-200/60 mt-1">Answers</div>
              </div>
            </Card>

            {/* Preferred Tags */}
            <Card className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition">
              <h3 className="text-lg font-semibold mb-4">Preferred Tags</h3>
              {profile?.preferred_tags && profile.preferred_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_tags.map((tag) => (
                    <Tag
                      key={tag}
                      className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-200/60">No preferred tags set</p>
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
            <Button key="cancel" onClick={handleCancel} className="!text-gray-300">
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
              <label className="text-white/80 text-sm mb-2 block">Bio</label>
              <TextArea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="!bg-white/5 !text-white !border-white/10"
                placeholder="Tell us about yourself..."
              />
            </div>
          </Space>
        </Modal>
      </div>
    </AuthGuard>
  );
}
