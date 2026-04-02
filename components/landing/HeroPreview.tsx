"use client";

import { Tag } from "antd";
import { CheckCircleFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";

export default function HeroPreview() {
  return (
    <div className="bg-surface-elevated rounded-2xl p-4 flex flex-col gap-3 border border-border">
      <div className="flex items-center justify-between border-b border-border-soft pb-3">
        <div className="text-base font-semibold text-primary">QStack Feed</div>
        <div className="flex gap-2 opacity-80">
          <span className="w-2 h-2 rounded-full bg-error/80" />
          <span className="w-2 h-2 rounded-full bg-warning/80" />
          <span className="w-2 h-2 rounded-full bg-success/80" />
        </div>
      </div>

      <div className="bg-surface rounded-xl p-3 border border-border-soft">
        <div className="text-base font-semibold text-text-primary">
          Best practices for CI/CD pipelines in microservices?
        </div>
        <div className="text-meta text-text-secondary mt-1">
          Looking for a clean workflow with GitHub Actions, Docker, and env promotion…
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary">DevOps</Tag>
          <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary">CI/CD</Tag>
          <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary">Docker</Tag>
        </div>

        <div className="mt-2 flex items-center gap-4 text-meta text-text-muted">
          <span className="inline-flex items-center gap-1"><LikeOutlined /> 24</span>
          <span className="inline-flex items-center gap-1"><MessageOutlined /> 8</span>
          <span>2h ago</span>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-3 mt-auto border border-border-soft">
        <div className="text-meta text-text-secondary inline-flex items-center gap-2">
          <CheckCircleFilled className="text-success" />
          Accepted answer: Use GitHub Actions + Docker build cache + staged deployments.
        </div>
      </div>
    </div>
  );
}