"use client";

import { Card, Tag, Pagination, Typography } from "antd";
import {
  QuestionCircleOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Question } from "@/types/question";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 5;

const { Text } = Typography;

interface MyQuestionsTabProps {
  questions: Question[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function MyQuestionsTab({
  questions,
  isLoading,
  currentPage,
  onPageChange,
}: MyQuestionsTabProps) {
  const router = useRouter();

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleQuestionClick = (id: number) => {
    router.push(`/question/${id}`);
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

  return (
    <Card className="bg-surface !rounded-xl !border-border-soft">
      {isLoading && questions.length === 0 ? (
        <div className="text-center py-12">
          <ClockCircleOutlined className="text-4xl text-text-muted mb-3" />
          <p className="text-text-muted">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <QuestionCircleOutlined className="text-4xl text-text-muted mb-3" />
          <p className="text-text-muted">No questions yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paginatedQuestions.map((item: Question) => (
              <div
                key={item.id}
                className="!border-border-soft hover:!bg-hover-bg transition px-4 py-3 rounded-lg cursor-pointer"
                onClick={() => handleQuestionClick(item.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Text className="!text-text-primary font-medium">
                        {item.title}
                      </Text>
                    </div>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center gap-4 text-meta text-text-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <ThunderboltOutlined className="text-warning" />
                          {item.vote_count} votes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageOutlined className="text-primary" />
                          {item.answer_count} answers
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockCircleOutlined />
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Tag
                            key={tag}
                            className="!bg-hover-bg !border-border-soft !text-text-secondary !text-meta"
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={questions.length}
                pageSize={PAGE_SIZE}
                onChange={onPageChange}
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
