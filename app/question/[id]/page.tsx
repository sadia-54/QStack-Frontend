"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Tag, Button } from "antd";
import {
  ThunderboltOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getQuestionById } from "@/api/question";
import { Question } from "@/types/question";

export default function QuestionDetail() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const id = parseInt(params.id as string);
        const data = await getQuestionById(id);
        setQuestion(data);
      } catch (error) {
        console.error("Failed to fetch question:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

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

        <Card
          className="glass !rounded-2xl !text-white !border-0"
          bodyStyle={{ padding: 0 }}
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
                {question.tags.map((tag) => (
                  <Tag
                    key={tag}
                    className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200 !text-sm !px-3 !py-1"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="text-gray-200/80 whitespace-pre-wrap leading-relaxed text-base break-words">
                {question.description}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
