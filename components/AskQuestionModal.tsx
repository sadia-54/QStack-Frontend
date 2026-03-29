"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { createQuestion } from "@/api/question";
import { CreateQuestionRequest } from "@/types/question";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import RichTextEditor from "@/components/TextEditor";

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
  const [description, setDescription] = useState("");
  const [form] = Form.useForm();

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (values: CreateQuestionRequest) => {
    if (!accessToken) {
      message.error("Please login to ask a question");
      return;
    }

    if (!description || description.trim() === "") {
      message.error("Please enter a description");
      return;
    }

    // Transform tags string to array (form provides string, API expects array)
    const tagsInput = (values as any).tags as string;
    const tagsArray = tagsInput
      .split(/[,\s]+/)
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    setLoading(true);

    try {
      await createQuestion(
        {
          ...values,
          description,
          tags: tagsArray,
        },
        accessToken
      );

      message.success("Question posted successfully!");

      form.resetFields();
      setDescription("");

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

  const handleClose = () => {
    form.resetFields();
    setDescription("");
    onClose();
  };

  return (
    <Modal
      open={open}
      width={1200}
      onCancel={handleClose}
      footer={null}
      centered
      className="glass-modal"
      styles={{
        body: {
          background: "var(--color-surface-elevated)",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
          padding: "24px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        },
        header: {
          borderBottom: "1px solid var(--color-border-soft)",
          paddingBottom: "12px",
        },
      }}
      title={
        <div>
          <EditOutlined className="text-primary" />
          <span className="text-xl font-semibold text-text-primary">Ask Question</span>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Title */}
        <Form.Item
        className="!mb-5"
          label={<span className="text-text-secondary">Title</span>}
          name="title"
          rules={[
            { required: true, message: "Please enter a title" },
            { min: 10, message: "Title must be at least 10 characters" },
          ]}
        >
          <Input
            placeholder="e.g., How to implement JWT authentication in Next.js?"
            size="large"
            className="!bg-surface !border hover:!border-accent focus:!border-accent"
            styles={{
              input: {
                color: "var(--color-text-primary)",
                ["::placeholder" as any]: {
                  color: "var(--color-text-muted)",
                },
              },
            }}
          />
        </Form.Item>

        {/* Description Editor */}
        <Form.Item label={<span className="text-text-secondary">Description</span>}>
          <RichTextEditor value={description} onChange={setDescription} />
        </Form.Item>

        {/* Tags */}
        <Form.Item
          label={<span className="text-text-secondary">Tags</span>}
          name="tags"
          rules={[
            { required: true, message: "Please enter at least one tag" },
            {
              validator: (_, value) => {
                if (!value || value.trim() === "") {
                  return Promise.reject("Please enter at least one tag");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="e.g., javascript react nextjs (comma or space separated)"
            size="large"
            className="!bg-surface !border hover:!border-accent focus:!border-accent"
            styles={{
              input: {
                color: "var(--color-text-primary)",
                ["::placeholder" as any]: {
                  color: "var(--color-text-muted)",
                },
              },
            }}
          />
        </Form.Item>

        {/* Buttons */}
        <Form.Item className="!mb-0 flex justify-end gap-3 pt-2">
          <Button
            size="large"
            onClick={handleClose}
            className="!bg-surface !text-text-primary !border hover:!border-accent"
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