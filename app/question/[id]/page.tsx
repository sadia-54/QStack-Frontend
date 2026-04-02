"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Tag, Button, App } from "antd";
import {
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { getQuestionById, updateQuestion, deleteQuestion, voteQuestion } from "@/api/question";
import { Question, CreateQuestionRequest } from "@/types/question";
import { Answer } from "@/types/answer";
import {
  getAnswersByQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
} from "@/api/answer";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setVote, removeVote } from "@/store/question/questionVoteSlice";
import { AnswerList, AnswerForm } from "@/components/Answer";
import EditAnswerModal from "@/components/EditAnswerModal";
import EditQuestionModal from "@/components/EditQuestionModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { Comment } from "@/types/comment";
import {
  getCommentsByAnswer,
  createComment,
  updateComment,
  deleteComment,
} from "@/api/comment";
import EditCommentModal from "@/components/EditCommentModal";

function useQuestionState() {
  const [question, setQuestion] = useState<Question | null>(null);
  return { question, setQuestion };
}

export default function QuestionDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
  const { isAuthenticated, currentUserId } = useSelector(
    (state: RootState) => state.auth
  );
  const { userVotes } = useSelector((state: RootState) => state.questionVote);
  const { question, setQuestion } = useQuestionState();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [commentsByAnswer, setCommentsByAnswer] = useState<Record<number, Comment[]>>({});
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false);
  const [updatingComment, setUpdatingComment] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'question' | 'answer' | 'comment'; id: number; answerId?: number } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const questionId = params.id ? parseInt(params.id as string) : 0;

  const userVote = question ? userVotes[question.id] : undefined;

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

  const currentUserIdNum = currentUserId ? Number(currentUserId) : null;
  const isQuestionOwner = question && currentUserIdNum ? question.author.id === currentUserIdNum : false;

  const fetchQuestion = async () => {
    try {
      const data = await getQuestionById(questionId);
      setQuestion(data);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const data = await getAnswersByQuestion(questionId);
      const fetchedAnswers = data || [];

      // Sort answers: accepted first, then newest first
      const sortedAnswers = [...fetchedAnswers].sort((a, b) => {
        // Accepted answer always first
        if (a.is_accepted && !b.is_accepted) return -1;
        if (!a.is_accepted && b.is_accepted) return 1;

        // For non-accepted (or both accepted), sort by newest first
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setAnswers(sortedAnswers);
    } catch (error) {
      console.error("Failed to fetch answers:", error);
      setAnswers([]);
    }
  };

  const fetchComments = async (answerId: number) => {
    try {
      const comments = await getCommentsByAnswer(answerId);
      setCommentsByAnswer((prev) => ({ ...prev, [answerId]: comments }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const toggleComments = async (answerId: number) => {
    const isExpanded = !!expandedComments[answerId];
    setExpandedComments((prev) => ({ ...prev, [answerId]: !isExpanded }));
    
    // Fetch comments on first expand
    if (!isExpanded && !commentsByAnswer[answerId]) {
      await fetchComments(answerId);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!questionId) return;
      setLoading(true);
      await Promise.all([fetchQuestion(), fetchAnswers()]);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const handleCreateAnswer = async (description: string) => {
    if (!isAuthenticated) {
      message.error("Please login to post an answer");
      router.push("/");
      return;
    }

    setSubmitting(true);
    try {
      await createAnswer(questionId, { description });
      message.success("Answer posted successfully!");
      await fetchAnswers();
      await fetchQuestion();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to post answer";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAnswer = async (description: string) => {
    if (!editingAnswer || !isAuthenticated) return;

    setUpdating(true);
    try {
      await updateAnswer(editingAnswer.id, { description });
      message.success("Answer updated successfully!");
      setIsEditModalOpen(false);
      setEditingAnswer(null);
      await fetchAnswers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update answer";
      message.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!isAuthenticated) return;
    setDeleteTarget({ type: 'answer', id: answerId });
    setIsDeleteModalOpen(true);
  };

  const handleAcceptAnswer = async (answerId: number) => {
    if (!isAuthenticated) return;

    try {
      await acceptAnswer(answerId);
      message.success("Answer accepted!");
      await fetchAnswers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to accept answer";
      message.error(errorMessage);
    }
  };

  const handleEditClick = (answer: Answer) => {
    setEditingAnswer(answer);
    setIsEditModalOpen(true);
  };

  const handleEditQuestionClick = () => {
    setIsEditQuestionModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateQuestion = async (data: CreateQuestionRequest) => {
    if (!question || !isAuthenticated) return;

    try {
      await updateQuestion(question.id, data);
      message.success("Question updated successfully!");
      setIsEditQuestionModalOpen(false);
      await fetchQuestion();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update question";
      message.error(errorMessage);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!question || !isAuthenticated) return;
    setDeleteTarget({ type: 'question', id: question.id });
    setIsDeleteModalOpen(true);
  };

  const handleAddComment = async (answerId: number, body: string) => {
    if (!isAuthenticated) {
      message.error("Please login to comment");
      return;
    }

    try {
      await createComment(answerId, { body });
      message.success("Comment added!");
      await fetchComments(answerId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add comment";
      message.error(errorMessage);
    }
  };

  const handleDeleteComment = async (answerId: number, commentId: number) => {
    if (!isAuthenticated) return;
    setDeleteTarget({ type: 'comment', id: commentId, answerId });
    setIsDeleteModalOpen(true);
  };

  const handleEditCommentClick = (comment: Comment) => {
    setEditingComment(comment);
    setIsEditCommentModalOpen(true);
  };

  const handleUpdateComment = async (body: string) => {
    if (!editingComment || !isAuthenticated) return;

    setUpdatingComment(true);
    try {
      await updateComment(editingComment.id, { body });
      message.success("Comment updated!");
      setIsEditCommentModalOpen(false);
      setEditingComment(null);
      // Refetch comments for all expanded answers to get updated comment
      await Promise.all(
        Object.keys(expandedComments)
          .filter((id) => expandedComments[parseInt(id)])
          .map((id) => fetchComments(parseInt(id)))
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update comment";
      message.error(errorMessage);
    } finally {
      setUpdatingComment(false);
    }
  };

  const handleVote = async (value: 1 | -1) => {
    if (!question || !isAuthenticated) {
      message.error("Please login to vote");
      router.push("/");
      return;
    }

    if (question.author.id === currentUserIdNum) {
      message.error("You cannot vote on your own question");
      return;
    }

    try {
      await voteQuestion(question.id, { value });

      // Update local vote state
      if (userVote === value) {
        // Removing vote (same vote clicked again)
        dispatch(removeVote({ questionId: question.id }));
        setQuestion({ ...question, vote_count: question.vote_count - value });
      } else {
        // New vote or changing vote
        const voteDiff = value - (userVote || 0);
        dispatch(setVote({ questionId: question.id, value }));
        setQuestion({ ...question, vote_count: question.vote_count + voteDiff });
      }

      message.success("Vote recorded!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to vote";
      message.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !isAuthenticated) return;

    try {
      if (deleteTarget.type === 'question') {
        await deleteQuestion(deleteTarget.id);
        message.success("Question deleted successfully!");
        router.push("/home");
      } else if (deleteTarget.type === 'answer') {
        await deleteAnswer(deleteTarget.id);
        message.success("Answer deleted successfully!");
        await fetchAnswers();
        await fetchQuestion();
      } else if (deleteTarget.type === 'comment') {
        await deleteComment(deleteTarget.id);
        message.success("Comment deleted!");
        if (deleteTarget.answerId) {
          await fetchComments(deleteTarget.answerId);
        }
      }
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${deleteTarget.type}`;
      message.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-accent/20" />
        <div className="glow -bottom-60 -right-60 bg-accent/10" />
        <div className="relative z-10 mx-auto max-w-[1100px] flex items-center justify-center min-h-[60vh]">
          <div className="text-text-muted text-lg">Loading question...</div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-accent/20" />
        <div className="glow -bottom-60 -right-60 bg-accent/10" />
        <div className="relative z-10 mx-auto max-w-[1100px]">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/home")}
            className="mb-4 !bg-selected-bg !border-border !text-text-primary hover:!bg-hover-bg"
          >
            Back to Home
          </Button>
          <Card className="bg-surface !rounded-2xl !text-white p-8 text-center">
            <div className="text-text-muted text-lg">Question not found</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative starry min-h-screen px-4 py-6">
      <div className="glow -top-60 -left-60 bg-primary/20" />
      <div className="glow -bottom-60 -right-60 bg-primary/10" />

      <div className="relative z-10 mx-auto w-full max-w-[calc(100vw-2rem)]">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/home")}
          className="mb-6 !bg-selected-bg !border-border !text-text-primary hover:!bg-hover-bg"
        >
          Back to Home
        </Button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Question Details & Answers */}
          <div className="col-span-7">
            {/* Question Card */}
            <Card
              className="bg-surface !rounded-2xl !text-white !border-0 mb-6"
              styles={{ body: { padding: 0 } }}
            >
              <div className="flex">
                <div className="w-[80px] bg-hover-bg flex flex-col items-center py-6 gap-4 rounded-l-2xl flex-shrink-0">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      type="text"
                      size="large"
                      icon={<UpOutlined className={`text-2xl ${userVote === 1 ? 'text-success' : 'text-text-muted hover:text-success'}`} />}
                      onClick={() => handleVote(1)}
                      disabled={!isAuthenticated}
                      className={`!p-2 ${!isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      title={isAuthenticated ? "Upvote" : "Login to vote"}
                    />
                    <span className="text-2xl font-bold text-text-primary">
                      {question.vote_count}
                    </span>
                    <Button
                      type="text"
                      size="large"
                      icon={<DownOutlined className={`text-2xl ${userVote === -1 ? 'text-error' : 'text-text-muted hover:text-error'}`} />}
                      onClick={() => handleVote(-1)}
                      disabled={!isAuthenticated}
                      className={`!p-2 ${!isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      title={isAuthenticated ? "Downvote" : "Login to vote"}
                    />
                    <span className="text-meta text-text-muted uppercase tracking-wide">votes</span>
                  </div>
                  <div className="w-8 h-px bg-border" />
                  <div className="flex flex-col items-center">
                    <MessageOutlined className="text-primary text-2xl mb-1" />
                    <span className="text-2xl font-bold text-text-primary">
                      {question.answer_count}
                    </span>
                    <span className="text-meta text-text-muted uppercase tracking-wide">answers</span>
                  </div>
                </div>

                <div className="flex-1 p-6 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-semibold text-text-primary break-words flex-1">
                      {question.title}
                    </h1>
                    {isQuestionOwner && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={handleEditQuestionClick}
                          className="!bg-selected-bg !border-primary/30 !text-text-primary hover:!bg-hover-bg"
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={handleDeleteQuestion}
                          className="!bg-error/20 !border-error/30 !text-text-primary hover:!bg-error/30"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-meta text-text-muted mb-4 pb-4 border-b border-border-soft">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-selected-bg flex items-center justify-center flex-shrink-0">
                        <UserOutlined className="text-primary text-meta" />
                      </div>
                      <span>{question.author.username}</span>
                    </div>
                    <span className="text-text-muted">•</span>
                    <div className="flex items-center gap-2">
                      <ClockCircleOutlined className="text-primary" />
                      <span>asked {formatDate(question.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {question.tags && question.tags.length > 0 ? (
                      question.tags.map((tag) => (
                        <Tag
                          key={tag}
                          className="!bg-hover-bg !border-border-soft !text-text-secondary !text-meta !px-3 !py-1"
                        >
                          {tag}
                        </Tag>
                      ))
                    ) : null}
                  </div>

                  <div
                    className="ProseMirror text-text-secondary max-w-none"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                  />
                </div>
              </div>
            </Card>

            {/* Answers Section */}
            <div className="mb-6">
              <h2 className="text-title mb-4 text-text-primary">
                {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
              </h2>

              <AnswerList
                answers={answers}
                isQuestionOwner={isQuestionOwner}
                currentUserId={currentUserIdNum}
                isAuthenticated={isAuthenticated}
                commentsByAnswer={commentsByAnswer}
                expandedComments={expandedComments}
                onAccept={handleAcceptAnswer}
                onEdit={handleEditClick}
                onDelete={handleDeleteAnswer}
                onAddComment={handleAddComment}
                onEditComment={handleEditCommentClick}
                onDeleteComment={handleDeleteComment}
                onToggleComments={toggleComments}
              />
            </div>
          </div>

          {/* Right Column - Submit Answer Form */}
          <div className="col-span-5">
            {isAuthenticated ? (
              <AnswerForm
                onSubmit={handleCreateAnswer}
                isSubmitting={submitting}
              />
            ) : (
              <Card className="bg-surface !rounded-2xl !text-white p-8 text-center">
                <div className="text-text-muted mb-4">
                  Please log in to post an answer
                </div>
                <Button
                  type="primary"
                  onClick={() => router.push("/")}
                  className="btn-gradient"
                >
                  Log In
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Answer Modal */}
      <EditAnswerModal
        answer={editingAnswer}
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAnswer(null);
        }}
        onSubmit={handleUpdateAnswer}
        isSubmitting={updating}
      />

      {/* Edit Question Modal */}
      <EditQuestionModal
        question={question}
        open={isEditQuestionModalOpen}
        onClose={() => {
          setIsEditQuestionModalOpen(false);
        }}
        onSuccess={fetchQuestion}
      />

      {/* Edit Comment Modal */}
      <EditCommentModal
        comment={editingComment}
        open={isEditCommentModalOpen}
        onClose={() => {
          setIsEditCommentModalOpen(false);
          setEditingComment(null);
        }}
        onSubmit={handleUpdateComment}
        isSubmitting={updatingComment}
      />

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        targetType={deleteTarget?.type || "question"}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
