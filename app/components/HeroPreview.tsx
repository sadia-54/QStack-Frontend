"use client";

import { Tag } from "antd";
import { CheckCircleFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";

export default function HeroPreview() {
  return (
    <div className="glass-strong q-card h-72 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="text-sm font-semibold text-purple-200">QStack Feed</div>
        <div className="flex gap-2 opacity-80">
          <span className="w-2 h-2 rounded-full bg-red-400/90" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/90" />
          <span className="w-2 h-2 rounded-full bg-green-400/90" />
        </div>
      </div>

      <div className="glass rounded-xl p-3">
        <div className="text-sm font-semibold">
          Best practices for CI/CD pipelines in microservices?
        </div>
        <div className="text-xs text-gray-300 mt-1">
          Looking for a clean workflow with GitHub Actions, Docker, and env promotion…
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Tag color="purple">DevOps</Tag>
          <Tag color="blue">CI/CD</Tag>
          <Tag color="geekblue">Docker</Tag>
        </div>

        <div className="mt-2 flex items-center gap-4 text-xs text-gray-200/80">
          <span className="inline-flex items-center gap-1"><LikeOutlined /> 24</span>
          <span className="inline-flex items-center gap-1"><MessageOutlined /> 8</span>
          <span className="text-gray-200/60">2h ago</span>
        </div>
      </div>

      <div className="glass rounded-xl p-3 mt-auto">
        <div className="text-xs text-gray-200/90 inline-flex items-center gap-2">
          <CheckCircleFilled className="text-green-400" />
          Accepted answer: Use GitHub Actions + Docker build cache + staged deployments.
        </div>
      </div>
    </div>
  );
}