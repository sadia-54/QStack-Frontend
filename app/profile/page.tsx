"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Form, Input, Button, message, Typography, Divider, Modal, Pagination, DatePicker, Avatar, Space, Card } from "antd";
const { TextArea } = Input;
import dayjs from "dayjs";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  StarOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  LockOutlined,
  CameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import AuthGuard from "@/components/AuthGuard";
import { fetchProfile, updateUserProfile, fetchUserActivity, updateUserPassword, fetchUserEmail, uploadProfileImageThunk } from "@/store/user/userThunks";
import { fetchMyQuestions } from "@/store/question/myQuestionsSlice";
import { ProfileTab, ActivityTab, MyQuestionsTab, SettingsTab } from "@/components/Profile";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 5;

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentUserId, isInitializing } = useSelector((state: RootState) => state.auth);
  const { profile, activities, isLoading, error, userEmail } = useSelector((state: RootState) => state.user);
  const { questions: myQuestions, isLoading: isQuestionsLoading } = useSelector((state: RootState) => state.myQuestions);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchProfile(currentUserId));
      dispatch(fetchUserEmail());
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

  if (isInitializing) {
    return (
      <AuthGuard>
        <div className="relative starry min-h-screen px-4 py-6">
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted">Loading...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBio = async () => {
    try {
      await dispatch(updateUserProfile(bio));
      message.success("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch {
      message.error("Failed to update profile");
    }
  };

  const handleCancelBio = () => {
    if (profile?.bio) {
      setBio(profile.bio);
    }
    setIsEditModalOpen(false);
  };

  const handleImageUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      await dispatch(uploadProfileImageThunk(file));
      message.success("Profile image updated successfully");
      setIsUploadModalOpen(false);
    } catch {
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLoadActivity = () => {
    if (currentUserId && activities.length === 0) {
      dispatch(fetchUserActivity(currentUserId));
    }
  };

  const handleLoadMyQuestions = () => {
    if (currentUserId && myQuestions.length === 0) {
      dispatch(fetchMyQuestions({ limit: 20, offset: 0 }));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuestionClick = (id: number) => {
    router.push(`/question/${id}`);
  };

  const handlePasswordChange = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      await dispatch(updateUserPassword(values.currentPassword, values.newPassword));
      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch {
    }
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Profile
        </span>
      ),
      children: <ProfileTab profile={profile} onEditClick={handleEditClick} />,
    },
    {
      key: "my-questions",
      label: (
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          My Questions
        </span>
      ),
      children: (
        <MyQuestionsTab
          questions={myQuestions}
          isLoading={isQuestionsLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      ),
    },
    {
      key: "activity",
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          Activity
        </span>
      ),
      children: <ActivityTab activities={activities} />,
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2">
          <LockOutlined />
          Settings
        </span>
      ),
      children: (
        <SettingsTab
          profile={profile}
          userEmail={userEmail}
          isLoading={isLoading}
          onPasswordChange={handlePasswordChange}
        />
      ),
    },
  ];

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
          <Card className="bg-surface !rounded-2xl !border-border-soft hover:!border-accent/50 transition mb-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar
                  size={80}
                  src={profile?.profile_image}
                  icon={<UserOutlined />}
                  className="!bg-surface-elevated !border-2 !border-primary/30"
                />
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<CameraOutlined />}
                    className="absolute -bottom-2 -right-2 h-8 w-8 !bg-primary hover:!bg-primary-hover"
                    onClick={handleImageUploadClick}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-text-primary">
                  {profile?.username || "User"}
                </h1>
                <p className="text-meta text-text-muted flex items-center gap-2 mt-1">
                  <MailOutlined />
                  {userEmail || "user@example.com"}
                </p>
                {profile?.bio && (
                  <p className="text-base text-text-secondary mt-3 line-clamp-2">{profile.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-meta text-text-muted">
                    <StarOutlined className="text-warning" />
                    <span>{profile?.total_votes || 0} reputation</span>
                  </div>
                  <div className="flex items-center gap-1 text-meta text-text-muted">
                    <ThunderboltOutlined className="text-primary" />
                    <span>{profile?.total_questions || 0} questions</span>
                  </div>
                  <div className="flex items-center gap-1 text-meta text-text-muted">
                    <MessageOutlined className="text-success" />
                    <span>{profile?.total_answers || 0} answers</span>
                  </div>
                </div>
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

          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              if (key === "activity") {
                handleLoadActivity();
              }
              if (key === "my-questions") {
                setCurrentPage(1);
                handleLoadMyQuestions();
              }
            }}
            items={tabItems}
            className="!text-white"
            destroyOnHidden={true}
          />
        </div>

        <Modal
          title="Edit Profile"
          open={isEditModalOpen}
          onOk={handleSaveBio}
          onCancel={handleCancelBio}
          className="glass-modal"
          footer={[
            <Button key="cancel" onClick={handleCancelBio} className="!text-text-secondary">
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSaveBio}
              className="btn-gradient"
              loading={isLoading}
            >
              Save Changes
            </Button>,
          ]}
        >
          <Space direction="vertical" className="w-full mt-4">
            <div>
              <label className="text-text-secondary text-meta mb-2 block">Bio</label>
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

        <Modal
          title="Upload Profile Image"
          open={isUploadModalOpen}
          onCancel={() => setIsUploadModalOpen(false)}
          className="glass-modal"
          footer={null}
        >
          <div className="py-4">
            <div className="text-center mb-4">
              <UploadOutlined className="text-4xl text-primary mb-2" />
              <p className="text-text-secondary">Select an image from your device</p>
              <p className="text-meta text-text-muted mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="profile-image-upload-modal"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploadingImage}
            />
            <Button
              type="primary"
              className="btn-gradient w-full"
              icon={<UploadOutlined />}
              loading={uploadingImage}
              size="large"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingImage ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
