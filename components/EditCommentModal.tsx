"use client";

import { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { Comment } from "@/types/comment";

interface Props {
  comment: Comment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (body: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EditCommentModal({
  comment,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [body, setBody] = useState("");

  useEffect(() => {
    if (comment) {
      setBody(comment.body);
    }
  }, [comment]);

  const handleSubmit = async () => {
    if (!body.trim() || body.length < 2) return;
    await onSubmit(body);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="dark-modal"
    >
      <div className="text-text-primary">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Edit Comment</h2>

        <Input.TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Edit your comment..."
          rows={4}
          maxLength={1000}
          className="!bg-input !border-border-soft !text-text-primary placeholder:text-text-muted focus:!border-primary/50"
        />

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
            className="!bg-surface !text-text-primary !border hover:!border-accent"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!body.trim() || body.length < 2 || isSubmitting}
            className="btn-gradient"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
