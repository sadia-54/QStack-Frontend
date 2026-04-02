"use client";

import { Card, Button } from "antd";
import { EditOutlined, StarOutlined, ThunderboltOutlined, MessageOutlined } from "@ant-design/icons";
import { Profile } from "@/types/user";

interface ProfileTabProps {
  profile: Profile | null;
  onEditClick: () => void;
}

export default function ProfileTab({ profile, onEditClick }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      {/* Bio Section */}
      <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-accent/50 transition">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">About Me</h3>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={onEditClick}
            className="!text-primary hover:!text-primary-hover"
          >
            Edit
          </Button>
        </div>
        {profile?.bio ? (
          <p className="text-text-secondary leading-relaxed">{profile.bio}</p>
        ) : (
          <p className="text-text-muted italic">No bio set yet. Click Edit to add one.</p>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-warning/50 transition">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-surface-elevated flex items-center justify-center text-warning">
              <StarOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-text-primary">
                {profile?.total_votes || 0}
              </div>
              <div className="text-meta text-text-muted">Reputation</div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-primary/50 transition">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-surface-elevated flex items-center justify-center text-primary">
              <ThunderboltOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-text-primary">
                {profile?.total_questions || 0}
              </div>
              <div className="text-meta text-text-muted">Questions</div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-success/50 transition">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-surface-elevated flex items-center justify-center text-success">
              <MessageOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-text-primary">
                {profile?.total_answers || 0}
              </div>
              <div className="text-meta text-text-muted">Answers</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Preferred Tags */}
      {/* <Card className="bg-surface !rounded-xl !border-border-soft hover:!border-primary/50 transition">
        <h3 className="text-title mb-4 text-text-primary">Preferred Tags</h3>
        {profile?.preferred_tags && profile.preferred_tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.preferred_tags.map((tag: string) => (
              <Tag
                key={tag}
                className="!bg-hover-bg !border-border-soft !text-text-secondary hover:!border-primary/50 transition"
              >
                {tag}
              </Tag>
            ))}
          </div>
        ) : (
          <p className="text-meta text-text-muted">No preferred tags set</p>
        )}
      </Card> */}
    </div>
  );
}
