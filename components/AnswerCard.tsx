"use client";

import { Card, Button } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Answer } from "@/types/answer";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(answer.is_accepted);

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

  // Extract first line as title (strip HTML tags)
  const getTitleFromContent = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    const firstLine = text.split("\n")[0].trim();
    return firstLine.length > 100 ? firstLine.substring(0, 100) + "..." : firstLine;
  };

  const answerTitle = getTitleFromContent(answer.description);
  const showAcceptButton = !answer.is_accepted && isQuestionOwner && !isAnswerOwner;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className={`glass !rounded-2xl !text-white !border-0 transition-all duration-300 overflow-hidden ${
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

        <div className="flex-1 p-6 overflow-hidden">
          {/* Collapsible header - always visible */}
          <div
            className="cursor-pointer flex items-center gap-3 mb-4 group"
            onClick={toggleExpand}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
              answer.is_accepted ? "bg-green-500/20" : "bg-purple-500/20"
            }`}>
              {isExpanded ? (
                <UpOutlined className={answer.is_accepted ? "text-green-300" : "text-purple-300"} />
              ) : (
                <DownOutlined className={answer.is_accepted ? "text-green-300" : "text-purple-300"} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-white truncate group-hover:text-purple-200 transition-colors">
                {answerTitle || "Answer"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-200/50 mt-1">
                <UserOutlined />
                <span className="truncate">{answer.author?.username || "Unknown"}</span>
                <span className="text-gray-200/30">•</span>
                <ClockCircleOutlined />
                <span>{formatDate(answer.created_at)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-200/40 group-hover:text-purple-300 transition-colors flex-shrink-0">
              {isExpanded ? "Collapse" : "Click to expand"}
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="animate-fadeIn">
              <div className="h-px bg-purple-500/10 mb-4" />

              {/* Answer content */}
              <div
                className="ProseMirror text-gray-200 max-w-none mb-4 break-words"
                dangerouslySetInnerHTML={{ __html: answer.description }}
              />

              {/* Actions */}
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
                    <span>answered {formatDate(answer.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Accept button - only for question owner and not own answer */}
                  {showAcceptButton && (
                    <Button
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept?.(answer.id);
                      }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(answer);
                        }}
                        className="!bg-purple-500/20 !border-purple-400/30 !text-purple-200 hover:!bg-purple-500/30 flex-shrink-0"
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(answer.id);
                        }}
                        className="!bg-red-500/20 !border-red-400/30 !text-red-200 hover:!bg-red-500/30 flex-shrink-0"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
