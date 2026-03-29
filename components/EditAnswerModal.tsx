"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import RichTextEditor from "./TextEditor";
import { Answer } from "@/types/answer";

interface Props {
  answer: Answer | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EditAnswerModal({
  answer,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (answer) {
      setDescription(answer.description);
    }
  }, [answer]);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    await onSubmit(description);
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
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Edit Your Answer</h2>

        <RichTextEditor
          value={description}
          onChange={setDescription}
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
            disabled={!description.trim() || isSubmitting}
            className="btn-gradient"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
