"use client";

import { Card, Button } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Answer } from "@/types/answer";

interface Props {
  answer: Answer;
  isQuestionOwner: boolean;
  isAnswerOwner: boolean;
  onAccept?: (answerId: number) => void;
  onEdit?: (answer: Answer) => void;
  onDelete?: (answerId: number) => void;
}

export default function AnswerCard({
  answer,
  isQuestionOwner,
  isAnswerOwner,
  onAccept,
  onEdit,
  onDelete,
}: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const showAcceptButton = !answer.is_accepted && isQuestionOwner && !isAnswerOwner;

  return (
    <Card
      className={`glass !rounded-2xl !text-white !border-0 ${
        answer.is_accepted ? "!border-green-500/30" : ""
      }`}
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex">
        {/* Accept badge */}
        {answer.is_accepted && (
          <div className="w-[80px] bg-green-900/20 flex flex-col items-center justify-start py-6 gap-2 rounded-l-2xl flex-shrink-0">
            <CheckCircleOutlined className="text-green-400 text-3xl" />
            <span className="text-xs text-green-200/80 uppercase tracking-wide text-center px-2">
              Accepted
            </span>
          </div>
        )}

        <div className="flex-1 p-6">
          {/* Answer content */}
          <div
            className="ProseMirror text-gray-200 max-w-none mb-4"
            dangerouslySetInnerHTML={{ __html: answer.description }}
          />

          {/* Author and actions */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/10">
            <div className="flex items-center gap-3 text-sm text-gray-200/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <UserOutlined className="text-purple-300 text-xs" />
                </div>
                <span>{answer.author?.username || "Unknown"}</span>
              </div>
              <span className="text-gray-200/30">•</span>
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-purple-300" />
                <span>{formatDate(answer.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Accept button - only for question owner and not own answer */}
              {showAcceptButton && (
                <Button
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onAccept?.(answer.id)}
                  className="!bg-green-500/20 !border-green-400/30 !text-green-200 hover:!bg-green-500/30"
                >
                  Accept
                </Button>
              )}

              {/* Edit/Delete buttons - only for answer owner */}
              {isAnswerOwner && (
                <>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit?.(answer)}
                    className="!bg-purple-500/20 !border-purple-400/30 !text-purple-200 hover:!bg-purple-500/30"
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete?.(answer.id)}
                    className="!bg-red-500/20 !border-red-400/30 !text-red-200 hover:!bg-red-500/30"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
