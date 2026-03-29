"use client";

import { Input, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { SortOption } from "@/types/question";
import { PREDEFINED_TAGS } from "@/utils/tags";

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
    <div className="bg-surface rounded-2xl px-6 py-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by title..."
            prefix={<SearchOutlined className="text-text-secondary" />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            size="large"
            className="filter-select filter-search-input"
            styles={{
              input: {
                color: "var(--color-text-primary)",
                ["::placeholder" as any]: { color: "var(--color-text-muted)" },
              },
            }}
          />
        </div>

        {/* Tag Select with predefined tags + custom input */}
        <div className="w-[180px]">
          <Select
            placeholder="Filter by tag..."
            prefix={<FilterOutlined className="text-text-secondary" />}
            value={tag ? [tag] : []}
            onChange={(value) => onTagChange(value[0] || "")}
            allowClear
            showSearch
            size="large"
            mode="tags"
            maxCount={1}
            className="filter-select"
            style={{ width: "100%" }}
            popupStyle={{
              background: "var(--color-surface-elevated)",
              borderColor: "var(--color-border)",
            }}
            filterOption={(input, option) => {
              const children = option?.children;
              return String(children ?? "").toLowerCase().includes(input.toLowerCase());
            }}
          >
            {PREDEFINED_TAGS.map((tagItem) => (
              <Option key={tagItem} value={tagItem}>
                {tagItem}
              </Option>
            ))}
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-[160px]">
          <Select
            value={sort}
            onChange={onSortChange}
            size="large"
            suffixIcon={<SortAscendingOutlined className="text-text-secondary" />}
            className="filter-select"
            popupStyle={{
              background: "var(--color-surface-elevated)",
              borderColor: "var(--color-border)",
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
            className="!bg-surface !text-text-primary !border hover:!border-accent"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
