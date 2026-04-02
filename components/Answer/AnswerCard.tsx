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
  MessageOutlined,
} from "@ant-design/icons";
import { Answer } from "@/types/answer";
import { Comment } from "@/types/comment";
import { useState } from "react";
import { CommentList, CommentForm } from "@/components/comment";

interface Props {
  answer: Answer;
  isQuestionOwner: boolean;
  isAnswerOwner: boolean;
  currentUserId: number | null;
  isAuthenticated: boolean;
  comments: Comment[];
  onAccept?: (answerId: number) => void;
  onEdit?: (answer: Answer) => void;
  onDelete?: (answerId: number) => void;
  onAddComment?: (body: string) => Promise<void>;
  onEditComment?: (comment: Comment) => void;
  onDeleteComment?: (commentId: number) => void;
  onToggleComments?: () => void;
  showComments: boolean;
}

export default function AnswerCard({
  answer,
  isQuestionOwner,
  isAnswerOwner,
  currentUserId,
  isAuthenticated,
  comments,
  onAccept,
  onEdit,
  onDelete,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleComments,
  showComments,
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
      className={`bg-surface !rounded-2xl !text-white !border-0 transition-all duration-300 overflow-hidden ${
        answer.is_accepted ? "!border-success/30" : ""
      }`}
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex">
        {/* Accept badge */}
        {answer.is_accepted && (
          <div className="w-[80px] bg-success/10 flex flex-col items-center justify-start py-6 gap-2 rounded-l-2xl flex-shrink-0">
            <CheckCircleOutlined className="text-success text-3xl" />
            <span className="text-meta text-text-secondary uppercase tracking-wide text-center px-2">
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
              answer.is_accepted ? "bg-success/20" : "bg-hover-bg"
            }`}>
              {isExpanded ? (
                <UpOutlined className={answer.is_accepted ? "text-success" : "text-text-secondary"} />
              ) : (
                <DownOutlined className={answer.is_accepted ? "text-success" : "text-text-secondary"} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {answerTitle || "Answer"}
              </h3>
              <div className="flex items-center gap-2 text-meta text-text-muted mt-1">
                <UserOutlined />
                <span className="truncate">{answer.author?.username || "Unknown"}</span>
                <span className="text-text-muted">•</span>
                <ClockCircleOutlined />
                <span>{formatDate(answer.created_at)}</span>
              </div>
            </div>
            <div className="text-meta text-text-muted group-hover:text-text-secondary transition-colors flex-shrink-0">
              {isExpanded ? "Collapse" : "Click to expand"}
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="animate-fadeIn">
              <div className="h-px bg-border-soft mb-4" />

              {/* Answer content */}
              <div
                className="ProseMirror text-text-secondary max-w-none mb-4 break-words"
                dangerouslySetInnerHTML={{ __html: answer.description }}
              />

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border-soft">
                <div className="flex items-center gap-3 text-meta text-text-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-selected-bg flex items-center justify-center flex-shrink-0">
                      <UserOutlined className="text-primary text-meta" />
                    </div>
                    <span>{answer.author?.username || "Unknown"}</span>
                  </div>
                  <span className="text-text-muted">•</span>
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-primary" />
                    <span>answered {formatDate(answer.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Comment toggle button */}
                  <Button
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComments?.();
                    }}
                    className="!bg-selected-bg !border-border-soft !text-text-primary hover:!bg-hover-bg flex-shrink-0"
                  >
                    {comments.length > 0 ? `${comments.length}` : "Comment"}
                  </Button>

                  {/* Accept button - only for question owner and not own answer */}
                  {showAcceptButton && (
                    <Button
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept?.(answer.id);
                      }}
                      className="!bg-success/20 !border-success/30 !text-text-primary hover:!bg-success/30"
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
                        className="!bg-selected-bg !border-primary/30 !text-text-primary hover:!bg-hover-bg flex-shrink-0"
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
                        className="!bg-error/20 !border-error/30 !text-text-primary hover:!bg-error/30 flex-shrink-0"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Comments section */}
              {showComments && (
                <>
                  <div className="h-px bg-border-soft my-4" />
                  <CommentList
                    comments={comments}
                    currentUserId={currentUserId}
                    onDelete={(commentId) => onDeleteComment?.(commentId)}
                    onEdit={(comment) => onEditComment?.(comment)}
                  />
                  {isAuthenticated && (
                    <CommentForm
                      onSubmit={(body) => onAddComment?.(body) || Promise.resolve()}
                      disabled={false}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
