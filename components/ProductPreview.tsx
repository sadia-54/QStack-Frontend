"use client";

import { Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function ProductPreview() {
  return (
    <div className="bg-surface-elevated rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-3">
        <div className="text-sm font-semibold text-primary">QStack</div>
        <div className="text-xs text-text-muted inline-flex items-center gap-2">
          <SearchOutlined />
          Search…
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 h-[calc(100%-52px)]">
        {/* Sidebar */}
        <div className="col-span-1 bg-surface rounded-xl p-3 space-y-3 border border-border-soft">
          <div className="text-xs text-text-secondary font-semibold">Navigation</div>
          {["Questions", "My Feed", "Tags", "Profile"].map((x) => (
            <div key={x} className="text-xs text-text-secondary px-2 py-2 rounded-lg hover:bg-hover-bg transition">
              {x}
            </div>
          ))}
          <div className="mt-auto text-[11px] text-text-muted">
            online • 12 users
          </div>
        </div>

        {/* Main */}
        <div className="col-span-3 bg-surface rounded-xl p-3 flex flex-col gap-3 border border-border-soft">
          <div>
            <div className="text-sm font-semibold text-text-primary">
              Best practices for setting up CI/CD pipelines in a microservices architecture?
            </div>
            <div className="text-xs text-text-secondary mt-1">
              I'm using Go + Next.js + PostgreSQL… what's the cleanest deployment approach?
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary">microservices</Tag>
            <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary">kubernetes</Tag>
            <Tag className="!bg-hover-bg !border-border-soft !text-text-secondary">github-actions</Tag>
          </div>

          {/* Answer block */}
          <div className="bg-surface rounded-xl p-3 border border-border">
            <div className="text-xs text-text-secondary font-semibold">Top Answer</div>
            <div className="text-xs text-text-secondary mt-1">
              Use GitHub Actions for CI, build OCI images, push to registry, deploy via Helm/ArgoCD.
              Promote envs with GitOps + separate values files.
            </div>
          </div>

          {/* Reply area */}
          <div className="mt-auto flex items-center justify-between text-xs text-text-muted">
            <span>▲ 24 votes</span>
            <span>💬 8 answers</span>
            <span>⭐ accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
}