"use client";

import { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginApi, signupApi, forgotPasswordApi } from "@/api/auth";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  clearError,
} from "@/store/auth/authSlice";
import { fetchProfile, fetchUserEmail } from "@/store/user/userThunks";
import { RootState, AppDispatch } from "@/store";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [signInForm] = Form.useForm();
  const [signUpForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();

  const handleTabChange = (key: string) => {
    setActiveTab(key as "signin" | "signup");
    signInForm.resetFields();
    signUpForm.resetFields();
    forgotPasswordForm.resetFields();
    dispatch(clearError());
    setShowForgotPassword(false);
  };

  const handleSignIn = async (values: { identifier: string; password: string }) => {
    try {
      dispatch(loginStart());
      const response = await loginApi(values);
      dispatch(
        loginSuccess({
          accessToken: "cookie",
          refreshToken: "cookie",
        })
      );
      // Fetch user profile data after login
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (userRes.ok) {
        const user = await userRes.json();
        const userId = user.id ?? user.user_id;
        if (userId) {
          dispatch(fetchProfile(userId));
          dispatch(fetchUserEmail());
        }
      }
      message.success(response.message || "Login successful!");
      signInForm.resetFields();
      onClose();
      router.push("/home");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      dispatch(loginFailure(errorMessage));
      message.error(errorMessage);
    }
  };

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      setIsForgotPasswordLoading(true);
      const response = await forgotPasswordApi(values);
      message.success(response.message || "Password reset link sent to your email");
      forgotPasswordForm.resetFields();
      setShowForgotPassword(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
      message.error(errorMessage);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleSignUp = async (values: {
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      dispatch(signupStart());
      const response = await signupApi(values);
      dispatch(signupSuccess());
      message.success(response.message);
      signUpForm.resetFields();
      setActiveTab("signin");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      dispatch(signupFailure(errorMessage));
      message.error(errorMessage);
    }
  };

  const signInTab = {
    key: "signin",
    label: "Sign In",
    children: showForgotPassword ? (
      <div>
        <Button
          type="link"
          onClick={() => setShowForgotPassword(false)}
          icon={<ArrowLeftOutlined />}
          className="mb-4 !pl-0 text-text-secondary"
        >
          Back to Sign In
        </Button>
        <h3 className="text-title text-text-primary mb-4">Reset Password</h3>
        <Form
          form={forgotPasswordForm}
          name="forgot-password"
          onFinish={handleForgotPassword}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className="!bg-surface !border hover:!border-accent focus:!border-accent"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isForgotPasswordLoading}
              className="w-full btn-gradient"
              size="large"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </div>
    ) : (
      <Form
        form={signInForm}
        name="signin"
        onFinish={handleSignIn}
        layout="vertical"
        size="large"
        autoComplete="off"
      >
        <Form.Item
          name="identifier"
          rules={[
            { required: true, message: "Please enter your email or username" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email or Username"
            className="!bg-surface !border hover:!border-accent focus:!border-accent"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="!bg-surface !border hover:!border-accent focus:!border-accent"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end mb-4">
            <Button
              type="link"
              onClick={() => setShowForgotPassword(true)}
              className="!pl-0 text-meta text-primary hover:!text-primary-hover"
            >
              Forgot Password?
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full btn-gradient"
            size="large"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    ),
  };

  const signUpTab = {
    key: "signup",
    label: "Sign Up",
    children: (
      <Form
        form={signUpForm}
        name="signup"
        onFinish={handleSignUp}
        layout="vertical"
        size="large"
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            className="!bg-surface !border hover:!border-accent focus:!border-accent"
          />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[
            { required: true, min: 3, message: "Username must be at least 3 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            className="!bg-surface !border hover:!border-accent focus:!border-accent"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    ),
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="auth-modal"
      title={null}
    >
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-text-primary text-center mb-6">
          {showForgotPassword
            ? "Reset Password"
            : activeTab === "signin"
            ? "Welcome Back"
            : "Join QStack"}
        </h2>
        {!showForgotPassword && (
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={[signInTab, signUpTab]}
            className="auth-tabs"
            size="large"
          />
        )}
        {showForgotPassword && (
          <div className="px-2">
            {signInTab.children}
          </div>
        )}
      </div>
    </Modal>
  );
}
