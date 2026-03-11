"use client";

import { useState } from "react";
import { Button, Modal } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import RichTextEditor from "./TextEditor";

interface Props {
  questionId: number;
  onSubmit: (description: string) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
}

export default function AnswerForm({
  questionId,
  onSubmit,
  onCancel,
  isSubmitting = false,
  placeholder = "Write your answer here...",
}: Props) {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) return;
    await onSubmit(description);
    setDescription("");
  };

  return (
    <div className="glass !rounded-2xl !text-white p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Your Answer</h3>
      
      <RichTextEditor
        value={description}
        onChange={setDescription}
      />

      <div className="flex items-center justify-end gap-3 mt-4">
        {onCancel && (
          <Button
            icon={<CloseOutlined />}
            onClick={onCancel}
            className="!bg-white/5 !text-white !border-white/10 hover:!border-purple-400/30"
          >
            Cancel
          </Button>
        )}
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!description.trim() || isSubmitting}
          className="btn-gradient"
        >
          Post Answer
        </Button>
      </div>
    </div>
  );
}
