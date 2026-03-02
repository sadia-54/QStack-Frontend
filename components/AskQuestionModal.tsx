"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { createQuestion } from "@/api/question";
import { CreateQuestionRequest } from "@/types/question";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AskQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AskQuestionModal({
  open,
  onClose,
  onSuccess,
}: AskQuestionModalProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (values: CreateQuestionRequest) => {
    if (!accessToken) {
      message.error("Please login to ask a question");
      return;
    }

    setLoading(true);
    try {
      await createQuestion(values, accessToken);
      message.success("Question posted successfully!");
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error(
        error instanceof Error ? error.message : "Failed to post question"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);
    form.setFieldsValue({ tags: tags.join(",") });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="glass-modal"
      styles={{
        body: {
          background: "rgba(17, 22, 44, 0.95)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "16px",
          backdropFilter: "blur(22px)",
        },
        header: {
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
        },
      }}
      title={
        <div className="flex items-center gap-2 text-white">
          <EditOutlined className="text-purple-300" />
          <span className="text-xl font-semibold">Ask Question</span>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label={<span className="text-gray-200/80">Title</span>}
          name="title"
          rules={[
            { required: true, message: "Please enter a title" },
            { min: 10, message: "Title must be at least 10 characters" },
          ]}
        >
          <Input
            placeholder="e.g., How to implement JWT authentication in Next.js?"
            size="large"
            className="!bg-white/5 !border-purple-400/20 !text-white hover:!border-purple-400/40 focus:!border-purple-400/60"
            styles={{
              input: {
                color: "white",
                ["::placeholder" as any]: { color: "rgba(255,255,255,0.4)" },
              },
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-200/80">Description</span>}
          name="description"
          rules={[
            { required: true, message: "Please enter a description" },
            { min: 20, message: "Description must be at least 20 characters" },
          ]}
        >
          <Input.TextArea
            placeholder="Describe your question in detail..."
            rows={6}
            size="large"
            className="!bg-white/5 !border-purple-400/20 !text-white hover:!border-purple-400/40 focus:!border-purple-400/60"
            styles={{
              textarea: {
                color: "white",
                ["::placeholder" as any]: { color: "rgba(255,255,255,0.4)" },
              },
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-200/80">Tags</span>}
          name="tags"
          rules={[
            { required: true, message: "Please enter at least one tag" },
          ]}
          getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            return value
              .split(",")
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag.length > 0);
          }}
        >
          <Input
            placeholder="e.g., javascript, react, nextjs (comma separated)"
            size="large"
            className="!bg-white/5 !border-purple-400/20 !text-white hover:!border-purple-400/40 focus:!border-purple-400/60"
            styles={{
              input: {
                color: "white",
                ["::placeholder" as any]: { color: "rgba(255,255,255,0.4)" },
              },
            }}
          />
        </Form.Item>

        <Form.Item className="!mb-0 flex justify-end gap-2">
          <Button
            size="large"
            onClick={onClose}
            className="!bg-white/5 !text-white !border-white/10 hover:!border-purple-400/30"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="btn-gradient"
          >
            Post Question
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
