"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Tag, Button } from "antd";
import {
  ThunderboltOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getQuestionFeed } from "@/api/question";
import { Question } from "@/types/question";
import AskQuestionModal from "@/components/AskQuestionModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function QuestionFeed() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const sortedQuestions = [...questions].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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

  const fetchQuestions = async () => {
    try {
      const data = await getQuestionFeed();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      window.location.href = "/";
      return;
    }
    setIsModalOpen(true);
  };

  const handleQuestionClick = (id: number) => {
    router.push(`/question/${id}`);
  };

  if (loading) {
    return (
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-purple-900/40" />
        <div className="glow -bottom-60 -right-60 bg-blue-900/40" />
        <div className="relative z-10 mx-auto max-w-[1200px] flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-200/60 text-lg">Loading questions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative starry min-h-screen px-4 py-6">
      <div className="glow -top-60 -left-60 bg-purple-900/40" />
      <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <header className="glass !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Question Feed</h1>
            <p className="text-sm text-gray-200/60 mt-1">
              Latest questions from the community
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleOpenModal}
            className="btn-gradient"
          >
            Ask Question
          </Button>
        </header>

        <div className="space-y-4">
          {sortedQuestions.map((q) => (
            <Card
              key={q.id}
              className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition cursor-pointer"
              onClick={() => handleQuestionClick(q.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="text-sm text-gray-200/60 flex items-center gap-1">
                    <ThunderboltOutlined className="text-yellow-400" />
                    {q.vote_count}
                  </div>
                  <div className="text-sm text-gray-200/60 flex items-center gap-1">
                    <MessageOutlined />
                    {q.answer_count}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-purple-200 hover:text-white transition">
                    {q.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-200/60">
                    <UserOutlined className="text-purple-300" />
                    <span>{q.author.username}</span>
                    <span className="text-gray-200/30">•</span>
                    <ClockCircleOutlined className="text-purple-300" />
                    <span>{formatDate(q.created_at)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {q.tags.map((tag) => (
                      <Tag
                        key={tag}
                        className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sortedQuestions.length === 0 && (
          <div className="glass !rounded-2xl !text-white p-8 text-center">
            <div className="text-gray-200/60 text-lg">
              No questions yet. Be the first to ask!
            </div>
          </div>
        )}
      </div>

      <AskQuestionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuestions}
      />
    </div>
  );
}