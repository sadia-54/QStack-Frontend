"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { resetPasswordApi } from "@/api/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleReset = async (values: { new_password: string }) => {
    if (!token) {
      message.error("Invalid or missing reset token");
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPasswordApi({
        token: token,
        new_password: values.new_password,
      });
      message.success(response.message || "Password reset successful");
      form.resetFields();
      router.push("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Reset failed";
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Reset Password</h1>
          <p className="text-text-secondary">
            Enter your new password below.
          </p>
        </div>

        <div className="glass-strong p-6 rounded-xl">
          <Form
            form={form}
            name="reset-password"
            onFinish={handleReset}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="new_password"
              rules={[
                { required: true, min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
                className="!bg-surface !border hover:!border-accent focus:!border-accent"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full btn-gradient"
                size="large"
              >
                Reset Password
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="link"
                onClick={() => router.push("/")}
                className="w-full text-center text-text-secondary"
              >
                Back to Home
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
