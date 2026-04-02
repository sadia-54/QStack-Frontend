"use client";

import { Card, Form, Input, Button, Space, Divider } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Profile } from "@/types/user";

interface SettingsTabProps {
  profile: Profile | null;
  userEmail: string | null;
  isLoading: boolean;
  onPasswordChange: (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
}

export default function SettingsTab({
  profile,
  userEmail,
  isLoading,
  onPasswordChange,
}: SettingsTabProps) {
  const [passwordForm] = Form.useForm();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Change Password */}
      <Card className="bg-surface !rounded-xl !border-border-soft">
        <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2">
          <LockOutlined />
          Change Password
        </h3>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onPasswordChange}
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
}
