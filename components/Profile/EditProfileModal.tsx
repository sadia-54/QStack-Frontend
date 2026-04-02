"use client";

import { Modal, Button, Space, Input } from "antd";

const { TextArea } = Input;

interface EditProfileModalProps {
  open: boolean;
  bio: string;
  isLoading: boolean;
  onBioChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProfileModal({
  open,
  bio,
  isLoading,
  onBioChange,
  onSave,
  onCancel,
}: EditProfileModalProps) {
  return (
    <Modal
      title="Edit Profile"
      open={open}
      onOk={onSave}
      onCancel={onCancel}
      className="glass-modal"
      footer={[
        <Button key="cancel" onClick={onCancel} className="!text-text-secondary">
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={onSave}
          className="btn-gradient"
          loading={isLoading}
        >
          Save Changes
        </Button>,
      ]}
    >
      <Space direction="vertical" className="w-full mt-4">
        <div>
          <label className="text-text-secondary text-meta mb-2 block">Bio</label>
          <TextArea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            rows={4}
            className="!bg-surface !text-text-primary !border hover:!border-accent focus:!border-accent"
            placeholder="Tell us about yourself..."
          />
        </div>
      </Space>
    </Modal>
  );
}
