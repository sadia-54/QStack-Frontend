"use client";

import { Comment } from "@/types/comment";
import { UserOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  comments: Comment[];
  currentUserId: number | null;
  onDelete: (commentId: number) => void;
  onEdit: (comment: Comment) => void;
}

export default function CommentList({ comments, currentUserId, onDelete, onEdit }: Props) {
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

  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-4 pt-4 border-t border-border-soft">
      <div className="text-xs text-text-muted uppercase tracking-wide mb-2">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </div>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-2 text-sm group"
        >
          <div className="w-6 h-6 rounded-full bg-selected-bg flex items-center justify-center flex-shrink-0">
            <UserOutlined className="text-primary text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-text-primary">{comment.author.username}</span>
              <span className="text-text-muted text-xs">{formatDate(comment.created_at)}</span>
            </div>
            <div className="text-text-secondary break-words mt-1">{comment.body}</div>
          </div>
          {currentUserId && comment.author.id === currentUserId && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined className="text-primary" />}
                onClick={() => onEdit(comment)}
                className="!text-primary hover:!bg-primary/10"
              />
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined className="text-error" />}
                onClick={() => onDelete(comment.id)}
                className="!text-error hover:!bg-error/10"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
