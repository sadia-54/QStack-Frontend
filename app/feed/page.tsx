"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Tag, Button, Input } from "antd";
import {
  MessageOutlined,
  ThunderboltOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FireOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Question } from "@/types/question";
import AskQuestionModal from "@/components/AskQuestionModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import AuthGuard from "@/components/AuthGuard";
import { fetchMyFeed, clearFeed } from "@/store/question/questionFeedSlice";

export default function Feed() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { questions, isLoading, hasMore } = useSelector(
    (state: RootState) => state.questionFeed
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const fetchQuestions = () => {
    dispatch(clearFeed());
    dispatch(fetchMyFeed({ limit: 20, offset: 0 }));
  };

  useEffect(() => {
    fetchQuestions();
  }, [dispatch]);

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

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="relative starry min-h-screen px-4 py-6">
          <div className="glow -top-60 -left-60 bg-purple-900/40" />
          <div className="glow -bottom-60 -right-60 bg-blue-900/40" />
          <div className="relative z-10 mx-auto max-w-[1200px] flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-200/60 text-lg">Loading feed...</div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-purple-900/40" />
        <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="glass !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">My Feed</h1>
              <p className="text-sm text-gray-200/60 mt-1">
                Personalized questions based on your interests
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={handleOpenModal}
              className="btn-gradient"
            >
              Ask Question
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search questions or tags..."
              prefix={<SearchOutlined className="text-purple-300" />}
              size="large"
              className="!bg-white/5 !border-purple-400/20 !text-white placeholder:text-gray-200/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Trending Tags */}
          <div className="mb-6 flex items-center gap-2">
            <FireOutlined className="text-orange-400" />
            <span className="text-gray-200/60 text-sm">Trending:</span>
            <div className="flex flex-wrap gap-2">
              {["javascript", "react", "typescript", "nodejs", "python"].map((tag) => (
                <Tag
                  key={tag}
                  className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200 cursor-pointer hover:!border-purple-400/40 transition"
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <Card
                key={q.id}
                className="glass !rounded-2xl !text-white hover:!border-purple-400/30 transition cursor-pointer"
                onClick={() => handleQuestionClick(q.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className="text-sm text-gray-200/60 flex items-center gap-1">
                      <UpOutlined className="text-yellow-400" />
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

          {filteredQuestions.length === 0 && !isLoading && (
            <div className="glass !rounded-2xl !text-white p-8 text-center">
              <div className="text-gray-200/60 text-lg">
                {searchTerm ? "No questions match your search" : "No questions in your feed yet"}
              </div>
              <p className="text-sm text-gray-200/40 mt-2">
                {searchTerm ? "Try a different search term" : "Start asking questions or voting on tags to build your feed"}
              </p>
            </div>
          )}
        </div>

        <AskQuestionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchQuestions}
        />
      </div>
    </AuthGuard>
  );
}
