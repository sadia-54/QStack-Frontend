"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Space, Tag, Tabs, Form, Input, Button, message, Typography, Divider, Modal, Pagination, DatePicker } from "antd";
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
  CheckCircleOutlined,
  CaretUpOutlined,
  UnlockOutlined,
  LockOutlined,
  SafetyOutlined,
  CameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import AuthGuard from "@/components/AuthGuard";
import { fetchProfile, updateUserProfile, fetchUserActivity, updateUserPassword, fetchUserEmail, uploadProfileImageThunk } from "@/store/user/userThunks";
import { fetchMyQuestions } from "@/store/question/myQuestionsSlice";
import { Question } from "@/types/question";
import { ActivityItem } from "@/types/user";

const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const PAGE_SIZE = 5;

// Activity type icon mapping
const getActivityIcon = (type: string) => {
  switch (type) {
    case "question":
      return <QuestionCircleOutlined className="text-primary" />;
    case "answer":
      return <MessageOutlined className="text-success" />;
    case "vote":
      return <CaretUpOutlined className="text-warning" />;
    case "accept":
      return <CheckCircleOutlined className="text-success" />;
    case "edit":
      return <EditOutlined className="text-text-muted" />;
    default:
      return <ClockCircleOutlined className="text-text-muted" />;
  }
};

// Activity type label mapping
const getActivityLabel = (type: string, entityType?: 'question' | 'answer') => {
  switch (type) {
    case "question":
      return "Asked a question";
    case "answer":
      return "Provided an answer";
    case "vote":
      return "Casted a vote";
      return "Received a vote";
    case "accept":
      return "Accepted an answer";
    case "edit":
      if (entityType === 'question') {
        return "Edited a question";
      } else if (entityType === 'answer') {
        return "Edited an answer";
      }
      return "Made an edit";
    default:
      return type;
  }
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

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

  // Password change form
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

  // Show loading while auth is initializing
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      message.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
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
      // Error already handled in thunk
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
      // Error already handled in thunk
    }
  };

  // Profile tab content
  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Bio Section */}
      <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-accent/50 transition">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">About Me</h3>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            className="!text-primary hover:!text-primary-hover"
          >
            Edit
          </Button>
        </div>
        {profile?.bio ? (
          <p className="text-text-secondary leading-relaxed">{profile.bio}</p>
        ) : (
          <p className="text-text-muted italic">No bio set yet. Click Edit to add one.</p>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-warning/50 transition">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-surface-elevated flex items-center justify-center text-warning">
              <StarOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-text-primary">
                {profile?.total_votes || 0}
              </div>
              <div className="text-meta text-text-muted">Reputation</div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-primary/50 transition">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-surface-elevated flex items-center justify-center text-primary">
              <ThunderboltOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-text-primary">
                {profile?.total_questions || 0}
              </div>
              <div className="text-meta text-text-muted">Questions</div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-success/50 transition">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-surface-elevated flex items-center justify-center text-success">
              <MessageOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-text-primary">
                {profile?.total_answers || 0}
              </div>
              <div className="text-meta text-text-muted">Answers</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Preferred Tags */}
      <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-primary/50 transition">
        <h3 className="text-title mb-4 text-text-primary">Preferred Tags</h3>
        {profile?.preferred_tags && profile.preferred_tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.preferred_tags.map((tag) => (
              <Tag
                key={tag}
                className="!bg-hover-bg !border-border-soft !text-text-secondary hover:!border-primary/50 transition"
              >
                {tag}
              </Tag>
            ))}
          </div>
        ) : (
          <p className="text-meta text-text-muted">No preferred tags set</p>
        )}
      </Card>
    </div>
  );

  // Activity tab content
  const ActivityTab = () => {
    const [activityDateRange, setActivityDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [activityPage, setActivityPage] = useState(1);

    // Filter activities by date range
    const filteredActivities = activityDateRange
      ? activities.filter((item) => {
          const activityDate = new Date(item.created_at);
          const startDate = activityDateRange[0].toDate();
          const endDate = activityDateRange[1].endOf('day').toDate();
          return activityDate >= startDate && activityDate <= endDate;
        })
      : activities;

    // Sort activities by date (newest first)
    const sortedActivities = [...filteredActivities].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Pagination
    const totalActivities = sortedActivities.length;
    const paginatedActivities = sortedActivities.slice(
      (activityPage - 1) * PAGE_SIZE,
      activityPage * PAGE_SIZE
    );

    // Get the question ID to navigate to for an activity
    const getQuestionIdForActivity = (item: ActivityItem): number | null => {
      if (item.type === 'question' && item.target_id) {
        return item.target_id;
      }
      if (item.type === 'answer' && item.question_id) {
        return item.question_id;
      }
      if ((item.type === 'vote' || item.type === 'edit' || item.type === 'accept') && item.target_id) {
        // For vote/edit/accept, if entity_type is question, use target_id directly
        if (item.entity_type === 'question') {
          return item.target_id;
        }
        // For answer-related activities, we need the question_id
        // If target_id is the answer ID, we need question_id to navigate
        return item.question_id || null;
      }
      return null;
    };

    // Check if activity is clickable
    const isActivityClickable = (item: ActivityItem): boolean => {
      return getQuestionIdForActivity(item) !== null;
    };

    // Handle activity click
    const handleActivityClick = (item: ActivityItem) => {
      const questionId = getQuestionIdForActivity(item);
      if (questionId) {
        router.push(`/question/${questionId}`);
      }
    };

    // Handle date range change
    const handleDateRangeChange = (dates: any) => {
      setActivityDateRange(dates);
      setActivityPage(1); // Reset to first page when date range changes
    };

    // Clear date filter
    const handleClearDateFilter = () => {
      setActivityDateRange(null);
      setActivityPage(1);
    };

    return (
      <Card className="bg-surface !rounded-xl !border-border-soft">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-title text-text-primary flex items-center gap-2">
            <ClockCircleOutlined />
            Recent Activity
          </h3>
          <Space wrap>
            <RangePicker
              value={activityDateRange}
              onChange={handleDateRangeChange}
              className="custom-range-picker"
              popupClassName="!bg-surface-elevated !border-border-soft"
              allowClear
            />
          </Space>
        </div>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <ClockCircleOutlined className="text-4xl text-text-muted mb-3" />
            <p className="text-text-muted">
              {activityDateRange ? "No activities in selected date range" : "No activity yet"}
            </p>
            {activityDateRange && (
              <Button type="link" onClick={handleClearDateFilter} className="!text-primary">
                Clear date filter
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {paginatedActivities.map((item, index) => {
                const clickable = isActivityClickable(item);
                return (
                  <div
                    key={`${item.target_id || ''}-${item.created_at}-${index}`}
                    className={`!border-border-soft hover:!bg-hover-bg transition px-4 py-3 rounded-lg flex items-start gap-4 ${clickable ? 'cursor-pointer' : ''}`}
                    onClick={() => clickable && handleActivityClick(item)}
                  >
                    <div className="h-10 w-10 rounded-lg bg-surface-elevated flex items-center justify-center text-lg flex-shrink-0">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Text className="!text-text-primary font-medium">
                          {getActivityLabel(item.type, item.entity_type)}
                        </Text>
                        {item.value !== undefined && item.value !== 0 && (
                          <Tag className="!bg-primary/20 !border-primary/30 !text-primary">
                            {item.value > 0 ? `+${item.value}` : item.value}
                          </Tag>
                        )}
                      </div>
                      <div className="space-y-1 mt-1">
                        {item.title && (
                          <p className="!text-text-secondary text-meta">{item.title}</p>
                        )}
                        <p className="!text-text-muted text-meta">
                          {formatRelativeTime(item.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalActivities > PAGE_SIZE && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={activityPage}
                  total={totalActivities}
                  pageSize={PAGE_SIZE}
                  onChange={setActivityPage}
                  showSizeChanger={false}
                  showLessItems
                />
              </div>
            )}
          </>
        )}
      </Card>
    );
  };

  // My Questions tab content
  const MyQuestionsTab = () => {
    const totalPages = Math.ceil(myQuestions.length / PAGE_SIZE);
    const paginatedQuestions = myQuestions.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

    return (
      <Card className="bg-surface !rounded-xl !border-border-soft">

        {isQuestionsLoading && myQuestions.length === 0 ? (
          <div className="text-center py-12">
            <ClockCircleOutlined className="text-4xl text-text-muted mb-3" />
            <p className="text-text-muted">Loading questions...</p>
          </div>
        ) : myQuestions.length === 0 ? (
          <div className="text-center py-12">
            <QuestionCircleOutlined className="text-4xl text-text-muted mb-3" />
            <p className="text-text-muted">No questions yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {paginatedQuestions.map((item: Question) => (
                <div
                  key={item.id}
                  className="!border-border-soft hover:!bg-hover-bg transition px-4 py-3 rounded-lg cursor-pointer"
                  onClick={() => handleQuestionClick(item.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Text className="!text-text-primary font-medium">
                          {item.title}
                        </Text>
                      </div>
                      <div className="space-y-2 mt-1">
                        <div className="flex items-center gap-4 text-meta text-text-muted flex-wrap">
                          <span className="flex items-center gap-1">
                            <ThunderboltOutlined className="text-warning" />
                            {item.vote_count} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageOutlined className="text-primary" />
                            {item.answer_count} answers
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockCircleOutlined />
                            {formatRelativeTime(item.created_at)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Tag
                              key={tag}
                              className="!bg-hover-bg !border-border-soft !text-text-secondary !text-meta"
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={myQuestions.length}
                  pageSize={PAGE_SIZE}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showLessItems
                />
              </div>
            )}
          </>
        )}
      </Card>
    );
  };

  // Settings tab content
  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="bg-surface !rounded-xl !border-border-soft">
        <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2">
          <LockOutlined />
          Change Password
        </h3>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          className="max-w-md"
        >
          <Form.Item
            label={<span className="!text-text-secondary">Current Password</span>}
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password
              className="!bg-surface-elevated !text-text-primary !border-border-soft hover:!border-accent focus:!border-primary"
              placeholder="Enter current password"
            />
          </Form.Item>

          <Form.Item
            label={<span className="!text-text-secondary">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              className="!bg-surface-elevated !text-text-primary !border-border-soft hover:!border-accent focus:!border-primary"
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            label={<span className="!text-text-secondary">Confirm New Password</span>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              className="!bg-surface-elevated !text-text-primary !border-border-soft hover:!border-accent focus:!border-primary"
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="btn-gradient"
                loading={isLoading}
                icon={<SafetyOutlined />}
              >
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Account Info */}
      <Card className="bg-surface !rounded-xl !border-border-soft">
        <h3 className="text-title mb-4 text-text-primary flex items-center gap-2">
          <UserOutlined />
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UnlockOutlined className="text-text-muted" />
            <div>
              <p className="text-meta text-text-secondary">Username</p>
              <p className="text-text-primary">{profile?.username}</p>
            </div>
          </div>
          <Divider className="!border-border-soft" />
          <div className="flex items-center gap-3">
            <MailOutlined className="text-text-muted" />
            <div>
              <p className="text-meta text-text-secondary">Email</p>
              <p className="text-text-primary">{userEmail || "N/A"}</p>
            </div>
          </div>
          <Divider className="!border-border-soft" />
          <div className="flex items-center gap-3">
            <ClockCircleOutlined className="text-text-muted" />
            <div>
              <p className="text-meta text-text-secondary">Member Since</p>
              <p className="text-text-primary">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Profile
        </span>
      ),
      children: <ProfileTab />,
    },
    {
      key: "my-questions",
      label: (
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          My Questions
        </span>
      ),
      children: <MyQuestionsTab />,
    },
    {
      key: "activity",
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          Activity
        </span>
      ),
      children: <ActivityTab />,
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2">
          <LockOutlined />
          Settings
        </span>
      ),
      children: <SettingsTab />,
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
          {/* Profile Header - Stack Overflow Style */}
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

          {/* Tabs Section */}
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

        {/* Edit Profile Modal */}
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

        {/* Upload Profile Image Modal */}
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
