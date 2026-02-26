"use client";

import { Button, Card } from "antd";
import {
  ThunderboltOutlined,
  FireOutlined,
  CompassOutlined,
  MailOutlined,
  SearchOutlined,
  CodeOutlined,
} from "@ant-design/icons";

import Navbar from "./components/Navbar";
import HeroPreview from "./components/HeroPreview";
import ProductPreview from "./components/ProductPreview";

const features = [
  { title: "Structured Q&A", desc: "Ask technical questions with tags.", icon: CompassOutlined },
  { title: "Smart Ranking", desc: "Community voting highlights best answers.", icon: FireOutlined },
  { title: "Personalized Feed", desc: "Content based on preferred tags.", icon: ThunderboltOutlined },
  { title: "Async Email Notifications", desc: "Never miss replies.", icon: MailOutlined },
  { title: "Advanced Search", desc: "Filter by tags, votes, and date.", icon: SearchOutlined },
  { title: "Developer Friendly", desc: "Markdown support + clean UX.", icon: CodeOutlined },
];

export default function Home() {
  return (
    <main className="relative starry min-h-screen px-2 py-4">
      {/* glow blobs */}
      <div className="glow -top-60 -left-60 bg-purple-900/40" />
      <div className="glow -bottom-60 -right-60 bg-blue-900/40" />

      <div className="relative z-10 mx-auto max-w-[1500px]">

        {/* HERO */}
        <section className="mt-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-5xl md:text-6xl font-semibold leading-tight">
              Ask.{" "}
              <span className="text-purple-300">Solve.</span>{" "}
              Grow Together.
            </div>

            <p className="mt-5 text-gray-200/75 text-lg">
              Join QStack, the modern Q&A platform where developers share knowledge,
              solve problems, and build reputation.
            </p>

            <div className="mt-6 flex gap-3">
              <Button className="btn-gradient" type="primary" size="large">
                Get Started
              </Button>
              <Button size="large" className="!bg-white/5 !text-white !border-white/10 hover:!border-white/20">
                Explore Questions
              </Button>
            </div>
          </div>

          <HeroPreview />
        </section>

        {/* FEATURES */}
        <section id="features" className="mt-10">
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;

              return (
                <Card
                  key={f.title}
                  className="q-card glass !rounded-2xl !text-white hover:!border-purple-400/30 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-400/20 flex items-center justify-center text-purple-200 text-lg">
                      <Icon />
                    </div>

                    <div>
                      <div className="text-base font-semibold">{f.title}</div>
                      <div className="text-sm text-gray-200/65 mt-1">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mt-14">
          <div className="text-3xl font-semibold mb-6">How It Works</div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { t: "1. Ask Questions", d: "Ask with tags, markdown, and clear titles." },
                { t: "2. Get Answers & Vote", d: "Community voting surfaces the best solution." },
                { t: "3. Build Reputation", d: "Earn trust and rank by helping others." },
              ].map((s) => (
                <div key={s.t} className="glass rounded-2xl p-4 border border-white/10">
                  <div className="text-purple-200 font-semibold">{s.t}</div>
                  <div className="text-sm text-gray-200/65 mt-1">{s.d}</div>
                </div>
              ))}
            </div>

            <ProductPreview />
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mt-12 grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-2xl font-semibold mb-3">Why Choose QStack?</div>
            <ul className="space-y-2 text-gray-200/75">
              <li>✔ Structured Q&A</li>
              <li>✔ Voting-Based Ranking</li>
              <li>✔ Personalized Feed</li>
              <li>✔ Modern UX</li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-2xl font-semibold mb-3">Traditional Forums</div>
            <ul className="space-y-2 text-gray-200/60">
              <li>✖ Random Discussions</li>
              <li>✖ No Quality Control</li>
              <li>✖ Generic Feed</li>
              <li>✖ Outdated Interface</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="community" className="mt-14 pb-20 text-center">
          <div className="text-3xl font-semibold">
            Ready to join the developer knowledge network?
          </div>
          <div className="mt-6">
            <Button className="btn-gradient" type="primary" size="large">
              Start Asking Questions
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}