"use client";

import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface ConfirmDeleteModalProps {
  open: boolean;
  targetType?: "question" | "answer" | "comment";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  open,
  targetType = "question",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const getTargetLabel = () => {
    switch (targetType) {
      case "answer":
        return "answer";
      case "comment":
        return "comment";
      default:
        return "question";
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <DeleteOutlined className="text-error text-xl" />
          <span>Confirm Delete</span>
        </div>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      centered
      className="!text-white"
    >
      <div className="text-text-secondary py-4">
        <p>Are you sure you want to delete this {getTargetLabel()}? This action cannot be undone.</p>
      </div>
    </Modal>
  );
}
