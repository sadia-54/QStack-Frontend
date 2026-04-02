"use client";

import { useState } from "react";
import { Card, Space, Tag, Pagination, DatePicker, Button, Typography } from "antd";
import dayjs from "dayjs";
import {
  ClockCircleOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  CaretUpOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { ActivityItem } from "@/types/user";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PAGE_SIZE = 5;

const getActivityIcon = (type: string) => {
  switch (type) {
    case "question":
      return <QuestionCircleOutlined className="text-primary" />;
    case "answer":
      return <MessageOutlined className="text-success" />;
    case "vote":
      return <CaretUpOutlined className="text-warning" />;
    case "accept":
      return <CheckCircleOutlined className="text-success" />;
    case "edit":
      return <EditOutlined className="text-text-muted" />;
    default:
      return <ClockCircleOutlined className="text-text-muted" />;
  }
};

const getActivityLabel = (type: string, entityType?: 'question' | 'answer') => {
  switch (type) {
    case "question":
      return "Asked a question";
    case "answer":
      return "Provided an answer";
    case "vote":
      return "Casted a vote";
    case "accept":
      return "Accepted an answer";
    case "edit":
      if (entityType === 'question') {
        return "Edited a question";
      } else if (entityType === 'answer') {
        return "Edited an answer";
      }
      return "Made an edit";
    default:
      return type;
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

interface ActivityTabProps {
  activities: ActivityItem[];
}

export default function ActivityTab({ activities }: ActivityTabProps) {
  const router = useRouter();
  const [activityDateRange, setActivityDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [activityPage, setActivityPage] = useState(1);

  const filteredActivities = activityDateRange
    ? (activities || []).filter((item) => {
        const activityDate = new Date(item.created_at);
        const startDate = activityDateRange[0]?.toDate();
        const endDate = activityDateRange[1]?.endOf('day').toDate();
        if (!startDate || !endDate) return false;
        return activityDate >= startDate && activityDate <= endDate;
      })
    : (activities || []);

  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalActivities = sortedActivities.length;
  const paginatedActivities = sortedActivities.slice(
    (activityPage - 1) * PAGE_SIZE,
    activityPage * PAGE_SIZE
  );

  const getQuestionIdForActivity = (item: ActivityItem): number | null => {
    if (item.type === 'question' && item.target_id) {
      return item.target_id;
    }
    if (item.type === 'answer' && item.question_id) {
      return item.question_id;
    }
    if ((item.type === 'vote' || item.type === 'edit' || item.type === 'accept') && item.target_id) {
      if (item.entity_type === 'question') {
        return item.target_id;
      }
      return item.question_id || null;
    }
    return null;
  };

  const isActivityClickable = (item: ActivityItem): boolean => {
    return getQuestionIdForActivity(item) !== null;
  };

  const handleActivityClick = (item: ActivityItem) => {
    const questionId = getQuestionIdForActivity(item);
    if (questionId) {
      router.push(`/question/${questionId}`);
    }
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setActivityDateRange(dates);
    setActivityPage(1);
  };

  const handleClearDateFilter = () => {
    setActivityDateRange(null);
    setActivityPage(1);
  };

  return (
    <Card className="bg-surface !rounded-xl !border-border-soft">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-title text-text-primary flex items-center gap-2">
          <ClockCircleOutlined />
          Recent Activity
        </h3>
        <Space wrap>
          <RangePicker
            value={activityDateRange}
            onChange={handleDateRangeChange}
            className="custom-range-picker"
            popupClassName="!bg-surface-elevated !border-border-soft"
            allowClear
          />
        </Space>
      </div>
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <ClockCircleOutlined className="text-4xl text-text-muted mb-3" />
          <p className="text-text-muted">
            {activityDateRange ? "No activities in selected date range" : "No activity yet"}
          </p>
          {activityDateRange && (
            <Button type="link" onClick={handleClearDateFilter} className="!text-primary">
              Clear date filter
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paginatedActivities.map((item, index) => {
              const clickable = isActivityClickable(item);
              return (
                <div
                  key={`${item.target_id || ''}-${item.created_at}-${index}`}
                  className={`!border-border-soft hover:!bg-hover-bg transition px-4 py-3 rounded-lg flex items-start gap-4 ${clickable ? 'cursor-pointer' : ''}`}
                  onClick={() => clickable && handleActivityClick(item)}
                >
                  <div className="h-10 w-10 rounded-lg bg-surface-elevated flex items-center justify-center text-lg flex-shrink-0">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Text className="!text-text-primary font-medium">
                        {getActivityLabel(item.type, item.entity_type)}
                      </Text>
                      {item.value !== undefined && item.value !== 0 && (
                        <Tag className="!bg-primary/20 !border-primary/30 !text-primary">
                          {item.value > 0 ? `+${item.value}` : item.value}
                        </Tag>
                      )}
                    </div>
                    <div className="space-y-1 mt-1">
                      {item.title && (
                        <p className="!text-text-secondary text-meta">{item.title}</p>
                      )}
                      <p className="!text-text-muted text-meta">
                        {formatRelativeTime(item.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalActivities > PAGE_SIZE && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={activityPage}
                total={totalActivities}
                pageSize={PAGE_SIZE}
                onChange={setActivityPage}
                showSizeChanger={false}
                showLessItems
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
