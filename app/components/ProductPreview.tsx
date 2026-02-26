"use client";

import { Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function ProductPreview() {
  return (
    <div className="glass-strong h-80 rounded-2xl p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="text-sm font-semibold text-purple-200">QStack</div>
        <div className="text-xs text-gray-200/70 inline-flex items-center gap-2">
          <SearchOutlined />
          Search…
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 h-[calc(100%-52px)]">
        {/* Sidebar */}
        <div className="col-span-1 glass rounded-xl p-3 space-y-3">
          <div className="text-xs text-gray-200/80 font-semibold">Navigation</div>
          {["Questions", "My Feed", "Tags", "Profile"].map((x) => (
            <div key={x} className="text-xs text-gray-200/70 px-2 py-2 rounded-lg hover:bg-white/5 transition">
              {x}
            </div>
          ))}
          <div className="mt-auto text-[11px] text-gray-200/50">
            online • 12 users
          </div>
        </div>

        {/* Main */}
        <div className="col-span-3 glass rounded-xl p-3 flex flex-col gap-3">
          <div>
            <div className="text-sm font-semibold">
              Best practices for setting up CI/CD pipelines in a microservices architecture?
            </div>
            <div className="text-xs text-gray-200/70 mt-1">
              I’m using Go + Next.js + PostgreSQL… what’s the cleanest deployment approach?
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag color="purple">microservices</Tag>
            <Tag color="geekblue">kubernetes</Tag>
            <Tag color="blue">github-actions</Tag>
          </div>

          {/* Answer block */}
          <div className="glass rounded-xl p-3 border border-white/10">
            <div className="text-xs text-gray-200/80 font-semibold">Top Answer</div>
            <div className="text-xs text-gray-200/70 mt-1">
              Use GitHub Actions for CI, build OCI images, push to registry, deploy via Helm/ArgoCD.
              Promote envs with GitOps + separate values files.
            </div>
          </div>

          {/* Reply area */}
          <div className="mt-auto flex items-center justify-between text-xs text-gray-200/60">
            <span>▲ 24 votes</span>
            <span>💬 8 answers</span>
            <span>⭐ accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
}