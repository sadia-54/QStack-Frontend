"use client";

import { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginApi, signupApi } from "@/api/auth";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  clearError,
} from "@/store/auth/authSlice";
import { RootState, AppDispatch } from "@/store";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [signInForm] = Form.useForm();
  const [signUpForm] = Form.useForm();

  const handleTabChange = (key: string) => {
    setActiveTab(key as "signin" | "signup");
    signInForm.resetFields();
    signUpForm.resetFields();
    dispatch(clearError());
  };

  const handleSignIn = async (values: { identifier: string; password: string }) => {
    try {
      dispatch(loginStart());
      const response = await loginApi(values);
      dispatch(
        loginSuccess({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        })
      );
      message.success("Login successful!");
      signInForm.resetFields();
      onClose();
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      dispatch(loginFailure(errorMessage));
      message.error(errorMessage);
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
    children: (
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
            className="!bg-white/5 !border-white/10 gap-1.5 hover:!border-purple-400/30 focus:!border-purple-400/50"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="!bg-white/5 !border-white/10 gap-1.5 hover:!border-purple-400/30 focus:!border-purple-400/50"
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
            className="!bg-white/5 !border-white/10 gap-1.5 hover:!border-purple-400/30 focus:!border-purple-400/50"
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
            className="!bg-white/5 !border-white/10 gap-1.5 hover:!border-purple-400/30 focus:!border-purple-400/50"
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
            className="!bg-white/5 !border-white/10 gap-1.5 hover:!border-purple-400/30 focus:!border-purple-400/50"
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
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {activeTab === "signin" ? "Welcome Back" : "Join QStack"}
        </h2>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[signInTab, signUpTab]}
          className="auth-tabs"
          size="large"
        />
      </div>
    </Modal>
  );
}
