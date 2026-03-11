"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Tag, Button, App } from "antd";
import {
  ThunderboltOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getQuestionById } from "@/api/question";
import { Question } from "@/types/question";
import { Answer } from "@/types/answer";
import {
  getAnswersByQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
} from "@/api/answer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AnswerCard from "@/components/AnswerCard";
import AnswerForm from "@/components/AnswerForm";
import EditAnswerModal from "@/components/EditAnswerModal";

export default function QuestionDetail() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { isAuthenticated, accessToken, currentUserId } = useSelector(
    (state: RootState) => state.auth
  );
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const questionId = params.id ? parseInt(params.id as string) : 0;

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

  useEffect(() => {
    const fetchData = async () => {
      if (!questionId) return;
      setLoading(true);
      await Promise.all([fetchQuestion(), fetchAnswers()]);
      setLoading(false);
    };
    fetchData();
  }, [questionId]);

  const handleCreateAnswer = async (description: string) => {
    if (!accessToken) {
      message.error("Please login to post an answer");
      router.push("/");
      return;
    }

    setSubmitting(true);
    try {
      await createAnswer(questionId, { description }, accessToken);
      message.success("Answer posted successfully!");
      await fetchAnswers();
      await fetchQuestion();
    } catch (error: any) {
      message.error(error.message || "Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAnswer = async (description: string) => {
    if (!editingAnswer || !accessToken) return;

    setUpdating(true);
    try {
      await updateAnswer(editingAnswer.id, { description }, accessToken);
      message.success("Answer updated successfully!");
      setIsEditModalOpen(false);
      setEditingAnswer(null);
      await fetchAnswers();
    } catch (error: any) {
      message.error(error.message || "Failed to update answer");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!accessToken) return;

    try {
      await deleteAnswer(answerId, accessToken);
      message.success("Answer deleted successfully!");
      await fetchAnswers();
      await fetchQuestion();
    } catch (error: any) {
      message.error(error.message || "Failed to delete answer");
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    if (!accessToken) return;

    try {
      await acceptAnswer(answerId, accessToken);
      message.success("Answer accepted!");
      await fetchAnswers();
    } catch (error: any) {
      message.error(error.message || "Failed to accept answer");
    }
  };

  const handleEditClick = (answer: Answer) => {
    setEditingAnswer(answer);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-purple-900/40" />
        <div className="glow -bottom-60 -right-60 bg-blue-900/40" />
        <div className="relative z-10 mx-auto max-w-[1100px] flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-200/60 text-lg">Loading question...</div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-purple-900/40" />
        <div className="glow -bottom-60 -right-60 bg-blue-900/40" />
        <div className="relative z-10 mx-auto max-w-[1100px]">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/question")}
            className="mb-4 !bg-purple-500/20 !border-purple-400/20 !text-purple-200 hover:!bg-purple-500/30"
          >
            Back to Feed
          </Button>
          <Card className="glass !rounded-2xl !text-white p-8 text-center">
            <div className="text-gray-200/60 text-lg">Question not found</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative starry min-h-screen px-4 py-6">
      <div className="glow -top-60 -left-60 bg-purple-900/40" />
      <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

      <div className="relative z-10 mx-auto max-w-[900px]">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/question")}
          className="mb-6 !bg-purple-500/20 !border-purple-400/20 !text-purple-200 hover:!bg-purple-500/30"
        >
          Back to Feed
        </Button>

        {/* Question Card */}
        <Card
          className="glass !rounded-2xl !text-white !border-0 mb-6"
          styles={{ body: { padding: 0 } }}
        >
          <div className="flex">
            <div className="w-[80px] bg-purple-900/20 flex flex-col items-center py-6 gap-4 rounded-l-2xl flex-shrink-0">
              <div className="flex flex-col items-center">
                <ThunderboltOutlined className="text-yellow-400 text-2xl mb-1" />
                <span className="text-2xl font-bold text-white">
                  {question.vote_count}
                </span>
                <span className="text-xs text-gray-200/60 uppercase tracking-wide">votes</span>
              </div>
              <div className="w-8 h-px bg-purple-500/30" />
              <div className="flex flex-col items-center">
                <MessageOutlined className="text-purple-300 text-2xl mb-1" />
                <span className="text-2xl font-bold text-white">
                  {question.answer_count}
                </span>
                <span className="text-xs text-gray-200/60 uppercase tracking-wide">answers</span>
              </div>
            </div>

            <div className="flex-1 p-6 min-w-0">
              <h1 className="text-2xl font-semibold text-white mb-4 break-words">
                {question.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-gray-200/60 mb-4 pb-4 border-b border-purple-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <UserOutlined className="text-purple-300 text-xs" />
                  </div>
                  <span>{question.author.username}</span>
                </div>
                <span className="text-gray-200/30">•</span>
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-purple-300" />
                  <span>asked {formatDate(question.created_at)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags && question.tags.length > 0 ? (
                  question.tags.map((tag) => (
                    <Tag
                      key={tag}
                      className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200 !text-sm !px-3 !py-1"
                    >
                      {tag}
                    </Tag>
                  ))
                ) : null}
              </div>

              <div
                className="ProseMirror text-gray-200 max-w-none"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />
            </div>
          </div>
        </Card>

        {/* Answers Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {/* Answer List */}
          {answers.length > 0 ? (
            <div className="space-y-4 mb-6">
              {answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isQuestionOwner={isQuestionOwner}
                  isAnswerOwner={currentUserIdNum ? answer.author.id === currentUserIdNum : false}
                  onAccept={handleAcceptAnswer}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteAnswer}
                />
              ))}
            </div>
          ) : (
            <Card className="glass !rounded-2xl !text-white p-8 text-center mb-6">
              <div className="text-gray-200/60 text-lg">
                No answers yet. Be the first to answer!
              </div>
            </Card>
          )}
        </div>

        {/* Answer Form */}
        {isAuthenticated ? (
          <AnswerForm
            questionId={questionId}
            onSubmit={handleCreateAnswer}
            isSubmitting={submitting}
          />
        ) : (
          <Card className="glass !rounded-2xl !text-white p-8 text-center">
            <div className="text-gray-200/60 mb-4">
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
    </div>
  );
}
