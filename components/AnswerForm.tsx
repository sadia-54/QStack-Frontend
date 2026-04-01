"use client";

import { useState } from "react";
import { Button } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import RichTextEditor from "./TextEditor";

interface Props {
  onSubmit: (description: string) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function AnswerForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) return;
    await onSubmit(description);
    setDescription("");
  };

  return (
    <div className="bg-surface !rounded-2xl !text-white p-6 border border-border-soft">
      <h3 className="text-title text-text-primary mb-4">Your Answer</h3>

      <RichTextEditor
        value={description}
        onChange={setDescription}
      />

      <div className="flex items-center justify-end gap-3 mt-4">
        {onCancel && (
          <Button
            icon={<CloseOutlined />}
            onClick={onCancel}
            className="!bg-surface !text-text-primary !border hover:!border-accent"
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
