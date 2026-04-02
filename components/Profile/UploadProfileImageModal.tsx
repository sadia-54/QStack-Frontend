"use client";

import { useRef } from "react";
import { Modal, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadProfileImageThunk } from "@/store/user/userThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

interface UploadProfileImageModalProps {
  open: boolean;
  uploadingImage: boolean;
  onCancel: () => void;
  setUploadingImage: (value: boolean) => void;
  setIsUploadModalOpen: (value: boolean) => void;
}

export default function UploadProfileImageModal({
  open,
  uploadingImage,
  onCancel,
  setUploadingImage,
  setIsUploadModalOpen,
}: UploadProfileImageModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      await dispatch(uploadProfileImageThunk(file));
      message.success("Profile image updated successfully");
      setIsUploadModalOpen(false);
    } catch {
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Modal
      title="Upload Profile Image"
      open={open}
      onCancel={onCancel}
      className="glass-modal"
      footer={null}
    >
      <div className="py-4">
        <div className="text-center mb-4">
          <UploadOutlined className="text-4xl text-primary mb-2" />
          <p className="text-text-secondary">Select an image from your device</p>
          <p className="text-meta text-text-muted mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          id="profile-image-upload-modal"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={uploadingImage}
        />
        <Button
          type="primary"
          className="btn-gradient w-full"
          icon={<UploadOutlined />}
          loading={uploadingImage}
          size="large"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadingImage ? "Uploading..." : "Choose Image"}
        </Button>
      </div>
    </Modal>
  );
}
