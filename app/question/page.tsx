"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Tag, Button, Pagination, Spin } from "antd";
import {
  ThunderboltOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getQuestionFeed } from "@/api/question";
import { Question, SortOption, FeedQueryParams } from "@/types/question";
import AskQuestionModal from "@/components/AskQuestionModal";
import FilterToolbar from "@/components/FilterToolbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const PAGE_SIZE = 5;
const DEBOUNCE_DELAY = 500; // ms

export default function QuestionFeed() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const hasActiveFilters = search !== "" || tag !== "" || sort !== "newest";

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params: FeedQueryParams = {
        search: search || undefined,
        tag: tag || undefined,
        sort: sort || undefined,
      };

      const data = await getQuestionFeed(params);
      let fetchedQuestions = data.questions || data || [];

      // Client-side sorting for "oldest" since backend only supports DESC
      if (sort === "oldest") {
        fetchedQuestions = [...fetchedQuestions].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error(error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [search, tag, sort]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTagChange = (value: string) => {
    setTag(value.toLowerCase().trim());
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setTag("");
    setSort("newest");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          <Spin size="large" className="text-purple-300" />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="relative starry min-h-screen px-4 py-6">
      <div className="glow -top-60 -left-60 bg-purple-900/40" />
      <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <header className="glass !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Question Feed</h1>
            <p className="text-sm text-gray-200/60 mt-1">
              {questions.length} {questions.length === 1 ? "question" : "questions"}
              {hasActiveFilters && " (filtered)"}
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

        <FilterToolbar
          search={search}
          tag={tag}
          sort={sort}
          onSearchChange={handleSearchChange}
          onTagChange={handleTagChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="space-y-4">
          {paginatedQuestions.map((q) => (
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
                    {q.tags.map((tagItem) => (
                      <Tag
                        key={tagItem}
                        className="!bg-purple-500/10 !border-purple-400/20 !text-purple-200"
                      >
                        {tagItem}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {paginatedQuestions.length === 0 && !loading && (
          <div className="glass !rounded-2xl !text-white p-8 text-center">
            <div className="text-gray-200/60 text-lg">
              {hasActiveFilters
                ? "No questions match your filters. Try adjusting your search."
                : "No questions yet. Be the first to ask!"}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={questions.length}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
              showSizeChanger={false}
              showLessItems
            />
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