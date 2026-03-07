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

    setLoading(true);

    try {
      await createQuestion(
        {
          ...values,
          description,
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
          background: "rgba(17, 22, 44, 0.95)",
          // border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
          padding: "24px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        },
        header: {
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
          paddingBottom: "12px",
        },
      }}
      title={
        <div >
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
        {/* Title */}
        <Form.Item
        className="!mb-5"
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
                ["::placeholder" as any]: {
                  color: "rgba(255,255,255,0.4)",
                },
              },
            }}
          />
        </Form.Item>

        {/* Description Editor */}
        <Form.Item label={<span className="text-gray-200/80 ">Description</span>}>
          <RichTextEditor value={description} onChange={setDescription} />
        </Form.Item>

        {/* Tags */}
        <Form.Item
          label={<span className="text-gray-200/80">Tags</span>}
          name="tags"
          rules={[{ required: true, message: "Please enter at least one tag" }]}
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
                ["::placeholder" as any]: {
                  color: "rgba(255,255,255,0.4)",
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
            className="!bg-white/5 mx-3 !text-white !border-white/10 hover:!border-purple-400/30"
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