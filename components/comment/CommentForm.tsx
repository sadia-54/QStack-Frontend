"use client";

import { useState } from "react";
import { Input, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";

interface Props {
  onSubmit: (body: string) => Promise<void>;
  disabled?: boolean;
}

export default function CommentForm({ onSubmit, disabled }: Props) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(body.trim());
      setBody("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <Input
        placeholder="Add a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSubmitting}
        size="small"
        className="!bg-input !border-border-soft !text-text-primary placeholder:text-text-muted focus:!border-primary/50"
        maxLength={1000}
      />
      <Button
        type="primary"
        size="small"
        icon={<MessageOutlined />}
        onClick={handleSubmit}
        disabled={disabled || isSubmitting || !body.trim()}
        className="flex-shrink-0"
      >
        Comment
      </Button>
    </div>
  );
}
