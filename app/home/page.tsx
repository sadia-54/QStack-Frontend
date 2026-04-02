"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Tag, Button, Spin, App, Collapse, Avatar } from "antd";
import {
  UserOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { getQuestionFeed, deleteQuestion, getPopularTags, getCommunityStats } from "@/api/question";
import { Question, SortOption, FeedQueryParams, TagStat, CommunityStats } from "@/types/question";
import { AskQuestionModal, EditQuestionModal } from "@/components/question";
import FilterToolbar from "@/components/common/FilterToolbar";
import QuestionList from "@/components/question/QuestionList";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import AuthGuard from "@/components/auth/AuthGuard";
import { fetchProfile } from "@/store/user/userThunks";

const DEBOUNCE_DELAY = 500;

const faqs = [
  {
    q: "What is QStack?",
    a: "QStack is a developer community where you can ask questions, share knowledge, and learn from others."
  },
  {
    q: "How do I ask a question?",
    a: "Click on the 'Ask Question' button, write your problem clearly, and add relevant tags."
  },
  {
    q: "What are tags?",
    a: "Tags help categorize questions so others can find and answer them easily."
  },
  {
    q: "Can I edit my question later?",
    a: "Yes, you can edit your questions and answers anytime from your profile or question page."
  },
  {
    q: "How does voting work?",
    a: "Users can upvote helpful questions and answers to highlight quality content."
  },
  {
    q: "Is QStack free to use?",
    a: "Yes, QStack is completely free for all users."
  }
];

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const { isAuthenticated, currentUserId } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<TagStat[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  // Initialize filters from URL query params on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlTag = searchParams.get("tag");
    const urlSort = searchParams.get("sort") as SortOption | null;

    if (urlSearch) setSearch(urlSearch);
    if (urlTag) setTag(urlTag);
    if (urlSort && ["newest", "oldest", "votes"].includes(urlSort)) {
      setSort(urlSort);
    }
  }, [searchParams]);

  // Fetch user profile on mount to get profile image
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchProfile(currentUserId));
    }
  }, [dispatch, currentUserId]);

  // Update URL query params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    if (sort !== "newest") params.set("sort", sort);

    const queryString = params.toString();
    const newPath = queryString ? `/home?${queryString}` : "/home";
    router.replace(newPath, { scroll: false });
  }, [search, tag, sort, router]);

  const hasActiveFilters = search !== "" || tag !== "" || sort !== "newest";

  const fetchPopularTags = async () => {
    try {
      const data = await getPopularTags();
      // Sort by count descending and take top 15
      const sorted = [...data].sort((a, b) => b.count - a.count);
      setPopularTags(sorted);
    } catch (error) {
      console.error("Failed to fetch popular tags:", error);
    }
  };

  const fetchCommunityStats = async () => {
    try {
      const data = await getCommunityStats();
      setCommunityStats(data);
    } catch (error) {
      console.error("Failed to fetch community stats:", error);
    }
  };

  const fetchQuestions = useCallback(async () => {
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

      // Deduplicate questions by id
      const uniqueQuestions = fetchedQuestions.filter(
        (q: Question, index: number, self: Question[]) => self.findIndex((item: Question) => item.id === q.id) === index
      );

      setQuestions(uniqueQuestions);
    } catch (error) {
      console.error(error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [search, tag, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tag, sort]);

  useEffect(() => {
    fetchPopularTags();
    fetchCommunityStats();
  }, []);

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

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleDeleteQuestion = (id: number) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteQuestion(deleteTarget);
      message.success("Question deleted successfully!");
      await fetchQuestions();
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete question";
      message.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="relative starry min-h-screen px-4 py-6">
          <div className="glow -top-60 -left-60 bg-accent/40" />
          <div className="glow -bottom-60 -right-60 bg-accent/40" />
          <div className="relative z-10 mx-auto max-w-[1400px] flex items-center justify-center min-h-[60vh]">
            <Spin size="large" className="text-text-muted" />
          </div>
        </div>
      </AuthGuard>
    );
  }

  const totalPages = Math.ceil(questions.length / 5);

  return (
    <AuthGuard>
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-accent/20" />
        <div className="glow -bottom-60 -right-60 bg-accent/10" />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <header className="bg-surface !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={profile?.profile_image}
                icon={<UserOutlined />}
                className="!bg-surface-elevated !border-2 !border-primary/30"
              />
              <div>
                <h1 className="text-3xl font-semibold text-text-primary">Welcome to QStack</h1>
                <p className="text-meta text-text-muted">Your developer Q&A community</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                className="btn-gradient"
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
              >
                Ask Question
              </Button>

            </div>
          </header>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">All Questions</h2>
              </div>

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

              <QuestionList
                questions={questions}
                totalPages={totalPages}
                currentPage={currentPage}
                currentUserId={currentUserId}
                loading={loading}
                hasActiveFilters={hasActiveFilters}
                onPageChange={handlePageChange}
                onQuestionClick={handleQuestionClick}
                onEditQuestion={handleEditQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                formatDate={formatDate}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              {/* Popular Tags */}
              <Card
                className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
              >
                <h3 className="text-title mb-4 text-text-primary">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 15).map((tag) => (
                    <Tag
                      key={tag.tag}
                      className="!bg-hover-bg !border-border-soft !text-text-secondary cursor-pointer hover:!border-accent transition"
                    >
                      {tag.tag}
                      <span className="text-text-muted ml-1">×{tag.count}</span>
                    </Tag>
                  ))}
                </div>
              </Card>

              {/* Community Stats */}
              <Card
                className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
              >
                <h3 className="text-title mb-4 text-text-primary">Community</h3>
                <div className="space-y-3 text-meta">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Members</span>
                    <span className="text-text-primary">{communityStats?.total_users.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Questions</span>
                    <span className="text-text-primary">{communityStats?.total_questions.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Answers</span>
                    <span className="text-text-primary">{communityStats?.total_answers.toLocaleString() || "0"}</span>
                  </div>
                </div>
              </Card>

              {/* FAQ */}
              <Card
                className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-title text-text-primary">FAQ</h3>
                  <Button
                    type="text"
                    size="small"
                    className="!text-text-primary hover:!text-accent"
                    onClick={() => setExpandedKeys(expandedKeys.length === faqs.length ? [] : faqs.map((_, i) => i.toString()))}
                    icon={expandedKeys.length === faqs.length ? <MinusCircleOutlined className="text-text-primary" /> : <PlusCircleOutlined className="text-text-primary" />}
                  >
                    {expandedKeys.length === faqs.length ? "Collapse All" : "Expand All"}
                  </Button>
                </div>
                <Collapse
                  ghost
                  activeKey={expandedKeys}
                  onChange={(keys) => setExpandedKeys(keys as string[])}
                  expandIconPlacement="end"
                  items={faqs.map((faq, index) => ({
                    key: index.toString(),
                    label: (
                      <span className="text-white font-semibold">{faq.q}</span>
                    ),
                    children: (
                      <div className="text-text-secondary text-base leading-relaxed pl-2">
                        {faq.a}
                      </div>
                    ),
                    className: "!border-border-soft last:!border-0",
                    expandIcon: ({ isActive }: { isActive: boolean }) => (
                      isActive
                        ? <MinusCircleOutlined className="text-white" />
                        : <PlusCircleOutlined className="text-text-muted" />
                    ),
                  }))}
                />
              </Card>
            </div>
          </section>
        </div>
      </div>

      <AskQuestionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuestions}
      />

      <EditQuestionModal
        question={editingQuestion}
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingQuestion(null);
        }}
        onSuccess={fetchQuestions}
      />

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        targetType="question"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
      />
    </AuthGuard>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="relative starry min-h-screen px-4 py-6">
        <div className="glow -top-60 -left-60 bg-accent/40" />
        <div className="glow -bottom-60 -right-60 bg-accent/40" />
        <div className="relative z-10 mx-auto max-w-[1400px] flex items-center justify-center min-h-[60vh]">
          <Spin size="large" className="text-text-muted" />
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
