"use client";

import { Card } from "antd";
import { Answer } from "@/types/answer";
import { Comment } from "@/types/comment";
import AnswerCard from "./AnswerCard";

interface AnswerListProps {
  answers: Answer[];
  isQuestionOwner: boolean;
  currentUserId: number | null;
  isAuthenticated: boolean;
  commentsByAnswer: Record<number, Comment[]>;
  expandedComments: Record<number, boolean>;
  onAccept: (answerId: number) => void;
  onEdit: (answer: Answer) => void;
  onDelete: (answerId: number) => void;
  onAddComment: (answerId: number, body: string) => Promise<void>;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (answerId: number, commentId: number) => void;
  onToggleComments: (answerId: number) => void;
}

export default function AnswerList({
  answers,
  isQuestionOwner,
  currentUserId,
  isAuthenticated,
  commentsByAnswer,
  expandedComments,
  onAccept,
  onEdit,
  onDelete,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleComments,
}: AnswerListProps) {
  if (answers.length === 0) {
    return (
      <Card className="bg-surface !rounded-2xl !text-white p-8 text-center">
        <div className="text-text-muted text-lg">
          No answers yet. Be the first to answer!
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {answers.map((answer) => (
        <AnswerCard
          key={answer.id}
          answer={answer}
          isQuestionOwner={isQuestionOwner}
          isAnswerOwner={currentUserId ? answer.author.id === currentUserId : false}
          currentUserId={currentUserId}
          isAuthenticated={isAuthenticated}
          comments={commentsByAnswer[answer.id] || []}
          showComments={!!expandedComments[answer.id]}
          onAccept={onAccept}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddComment={(body) => onAddComment(answer.id, body)}
          onEditComment={onEditComment}
          onDeleteComment={(commentId) => onDeleteComment(answer.id, commentId)}
          onToggleComments={() => onToggleComments(answer.id)}
        />
      ))}
    </div>
  );
}
