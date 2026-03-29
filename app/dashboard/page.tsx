"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, Card, Tag } from "antd";
import {
  ThunderboltOutlined,
  FireOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { RootState, AppDispatch } from "@/store";
import { logoutUser } from "@/store/auth/authThunks";
import AuthGuard from "@/components/AuthGuard";

const popularTags = [
  { name: "javascript", count: 1234 },
  { name: "react", count: 987 },
  { name: "typescript", count: 856 },
  { name: "nodejs", count: 743 },
  { name: "python", count: 654 },
  { name: "css", count: 521 },
];

const recentQuestions = [
  {
    id: 1,
    title: "How to implement JWT authentication in Next.js?",
    tags: ["nextjs", "jwt", "authentication"],
    votes: 24,
    answers: 5,
    views: 1205,
  },
  {
    id: 2,
    title: "Best practices for Redux Toolkit state management",
    tags: ["redux", "react", "state-management"],
    votes: 18,
    answers: 3,
    views: 892,
  },
  {
    id: 3,
    title: "Understanding TypeScript generics with examples",
    tags: ["typescript", "generics"],
    votes: 31,
    answers: 7,
    views: 1543,
  },
  {
    id: 4,
    title: "How to optimize React performance with useMemo and useCallback",
    tags: ["react", "performance", "hooks"],
    votes: 42,
    answers: 9,
    views: 2103,
  },
];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  return (
    <AuthGuard>
    <div className="relative starry min-h-screen px-4 py-6">
      {/* glow blobs */}
      <div className="glow -top-60 -left-60 bg-accent/20" />
      <div className="glow -bottom-60 -right-60 bg-accent/10" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header */}
        <header className="bg-surface !border-0 backdrop-blur-xl rounded-2xl px-8 py-5 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-hover-bg border border-border flex items-center justify-center text-primary text-xl">
              <UserOutlined />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Welcome to QStack</h1>
              <p className="text-sm text-text-muted">Your developer Q&A dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="btn-gradient"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Questions", value: "0", icon: MessageOutlined, color: "text-primary" },
            { title: "Answers", value: "0", icon: FireOutlined, color: "text-warning" },
            { title: "Reputation", value: "0", icon: StarOutlined, color: "text-warning" },
            { title: "Badges", value: "0", icon: ThunderboltOutlined, color: "text-primary" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-text-muted">{stat.title}</div>
                    <div className="text-3xl font-semibold mt-1 text-text-primary">{stat.value}</div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-surface flex items-center justify-center ${stat.color}`}>
                    <Icon className="text-2xl" />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Main Content */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* Recent Questions */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">Recent Questions</h2>
              <Button
                type="primary"
                className="btn-gradient"
                size="small"
              >
                View All
              </Button>
            </div>

            {recentQuestions.map((question) => (
              <Card
                key={question.id}
                className="bg-surface !rounded-xl !text-white hover:!border-accent transition cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className="text-sm text-text-muted flex items-center gap-1">
                      <ThunderboltOutlined className="text-warning" />
                      {question.votes}
                    </div>
                    <div className="text-sm text-text-muted flex items-center gap-1">
                      <MessageOutlined />
                      {question.answers}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-text-primary hover:text-primary transition">
                      {question.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.tags.map((tag) => (
                        <Tag
                          key={tag}
                          className="!bg-hover-bg !border-border-soft !text-text-secondary"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-text-muted">
                    {question.views.toLocaleString()} views
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Ask Question */}
            <Card
              className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
            >
              <h3 className="text-lg font-semibold mb-3 text-text-primary">Have a question?</h3>
              <p className="text-sm text-text-muted mb-4">
                Ask the community and get answers from experienced developers.
              </p>
              <Button
                type="primary"
                className="w-full btn-gradient"
                size="large"
              >
                Ask Question
              </Button>
            </Card>

            {/* Popular Tags */}
            <Card
              className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
            >
              <h3 className="text-lg font-semibold mb-4 text-text-primary">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Tag
                    key={tag.name}
                    className="!bg-hover-bg !border-border-soft !text-text-secondary cursor-pointer hover:!border-accent transition"
                  >
                    {tag.name}
                    <span className="text-text-muted ml-1">×{tag.count}</span>
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Community Stats */}
            <Card
              className="bg-surface !rounded-2xl !text-white hover:!border-accent transition"
            >
              <h3 className="text-lg font-semibold mb-4 text-text-primary">Community</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Members</span>
                  <span className="text-text-primary">12,543</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Questions</span>
                  <span className="text-text-primary">8,921</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Answers</span>
                  <span className="text-text-primary">24,567</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
    </AuthGuard>
  );
}
