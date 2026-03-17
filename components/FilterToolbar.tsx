"use client";

import { Input, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { SortOption } from "@/types/question";

const { Option } = Select;

interface FilterToolbarProps {
  search: string;
  tag: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function FilterToolbar({
  search,
  tag,
  sort,
  onSearchChange,
  onTagChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: FilterToolbarProps) {
  return (
    <div className="glass !border-0 backdrop-blur-xl rounded-2xl px-6 py-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by title..."
            prefix={<SearchOutlined className="text-purple-300" />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            size="large"
            className="!bg-white/5 !border-purple-400/20 !text-white hover:!border-purple-400/40 focus:!border-purple-400/60"
            styles={{
              input: {
                color: "white",
                ["::placeholder" as any]: { color: "rgba(255,255,255,0.4)" },
              },
            }}
          />
        </div>

        {/* Tag Input */}
        <div className="w-[180px]">
          <Input
            placeholder="Filter by tag..."
            prefix={<FilterOutlined className="text-purple-300" />}
            value={tag || undefined}
            onChange={(e) => onTagChange(e.target.value)}
            allowClear
            size="large"
            className="!bg-white/5 !border-purple-400/20 !text-white hover:!border-purple-400/40 focus:!border-purple-400/60"
            styles={{
              input: {
                color: "white",
                ["::placeholder" as any]: { color: "rgba(255,255,255,0.4)" },
              },
            }}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="w-[160px]">
          <Select
            value={sort}
            onChange={onSortChange}
            size="large"
            suffixIcon={<SortAscendingOutlined className="text-purple-300" />}
            className="filter-select"
            popupStyle={{
              background: "rgba(17, 22, 44, 0.95)",
              borderColor: "rgba(139, 92, 246, 0.3)",
            }}
          >
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
            <Option value="votes">Votes</Option>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            size="large"
            onClick={onClearFilters}
            className="!bg-white/5 !text-white !border-purple-400/20 hover:!border-purple-400/40"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
