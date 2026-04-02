"use client";

import { Card, Tag, Button, Pagination } from "antd";
import {
  ThunderboltOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Question } from "@/types/question";

interface QuestionListProps {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  currentUserId: number | null;
  loading: boolean;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onQuestionClick: (id: number) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: number) => void;
  formatDate: (dateString: string) => string;
}

export default function QuestionList({
  questions,
  totalPages,
  currentPage,
  currentUserId,
  loading,
  hasActiveFilters,
  onPageChange,
  onQuestionClick,
  onEditQuestion,
  onDeleteQuestion,
  formatDate,
}: QuestionListProps) {
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {paginatedQuestions.map((q) => {
          const isOwner = currentUserId ? q.author.id === Number(currentUserId) : false;

          return (
            <Card
              key={q.id}
              className="glass !rounded-2xl !text-white hover:!border-accent transition cursor-pointer"
              onClick={() => onQuestionClick(q.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="text-meta text-text-muted flex items-center gap-1">
                    <ThunderboltOutlined className="text-yellow-400" />
                    {q.vote_count}
                  </div>
                  <div className="text-meta text-text-muted flex items-center gap-1">
                    <MessageOutlined />
                    {q.answer_count}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-title text-text-primary hover:text-primary transition flex-1">
                      {q.title}
                    </h3>
                    {isOwner && (
                      <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => onEditQuestion(q)}
                          className="!bg-selected-bg !border-accent/30 !text-text-primary hover:!bg-hover-bg"
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => onDeleteQuestion(q.id)}
                          className="!bg-red-500/20 !border-red-400/30 !text-red-200 hover:!bg-red-500/30"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-meta text-text-muted">
                    <UserOutlined className="text-text-secondary" />
                    <span>{q.author.username}</span>
                    <span className="text-gray-200/30">•</span>
                    <ClockCircleOutlined className="text-text-secondary" />
                    <span>{formatDate(q.created_at)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {q.tags.map((tagItem) => (
                      <Tag
                        key={tagItem}
                        className="!bg-hover-bg !border-border-soft !text-text-secondary"
                      >
                        {tagItem}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {paginatedQuestions.length === 0 && !loading && (
        <div className="glass !rounded-2xl !text-white p-8 text-center">
          <div className="text-text-muted text-base">
            {hasActiveFilters
              ? "No questions match your filters. Try adjusting your search."
              : "No questions yet. Be the first to ask!"}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={questions.length}
            pageSize={5}
            onChange={onPageChange}
            showSizeChanger={false}
            showLessItems
          />
        </div>
      )}
    </div>
  );
}
