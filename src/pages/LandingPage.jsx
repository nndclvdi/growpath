import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Brain, BarChart3, ShieldCheck, BookOpen, Star, Menu, CheckCircle2, Code2, Database, Palette, Shield, Smartphone, LineChart,} from 'lucide-react';

import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F7FB] text-slate-900 overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>

            <h1 className="font-black text-indigo-600 text-xl">
              GrowPath
            </h1>
          </div>

          {/* MENU */}
          <div className="hidden md:flex items-center gap-10 text-sm text-slate-600 font-medium">
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>

            <a href="#careers" className="hover:text-indigo-600 transition">
              Careers
            </a>

            <a href="#dashboard" className="hover:text-indigo-600 transition">
              Dashboard
            </a>

            <a href="#steps" className="hover:text-indigo-600 transition">
              Get Started
            </a>
          </div>

          {/* BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
            >
              Register
            </button>
          </div>

          <button className="md:hidden">
            <Menu />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-fuchsia-500 mb-6">
              <Sparkles size={14} />
              Discover Your Future
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-[-0.04em] mb-8">
              Discover Your
              <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
                {' '}IT Career Path.
              </span>
            </h1>

            <p className="text-slate-500 leading-relaxed text-lg max-w-xl mb-10">
              GrowPath helps you identify your interests, strengths, and best
              tech career matches through AI-powered assessments and personalized learning roadmaps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">

              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 hover:scale-105 transition-all"
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button className="px-8 py-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 font-medium transition">
                Take Free Assessment
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span>Personalized AI Roadmaps</span>
              <span>Career Discovery</span>
              <span>24/7 Learning Support</span>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >

            <div className="bg-white rounded-[30px] border border-slate-100 shadow-2xl shadow-indigo-100/40 p-6">

              {/* TOP BAR */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              {/* TITLE */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-1">
                  Career Match Analytics
                </h3>

                <p className="text-sm text-slate-400">
                  AI recommendation dashboard
                </p>
              </div>

              {/* PROGRESS */}
              <div className="space-y-6">

                <ProgressItem
                  title="Frontend Development"
                  percent="92%"
                  width="92%"
                  color="from-indigo-500 to-indigo-400"
                />

                <ProgressItem
                  title="Problem Solving"
                  percent="84%"
                  width="84%"
                  color="from-fuchsia-500 to-pink-400"
                />

                <ProgressItem
                  title="Communication"
                  percent="76%"
                  width="76%"
                  color="from-cyan-500 to-sky-400"
                />

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

            <StatCard value="10K+" label="Active Learners" />
            <StatCard value="500+" label="Tech Roadmaps" />
            <StatCard value="95%" label="Success Rate" />
            <StatCard value="50+" label="Tech Careers" />

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="py-28 px-5 md:px-8"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <p className="text-fuchsia-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Powerful Features
            </p>

            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Everything you need to discover
              <br />
              and pursue your IT career.
            </h2>

            <p className="text-slate-500 max-w-2xl mx-auto">
              Build learning roadmaps, explore tech careers, and analyze your skills with AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <FeatureCard
              icon={<Brain size={22} />}
              title="AI Interest Assessment"
              desc="Discover your strengths through intelligent AI analysis."
            />

            <FeatureCard
              icon={<BookOpen size={22} />}
              title="Personalized Roadmap"
              desc="Get learning paths tailored specifically to your goals."
            />

            <FeatureCard
              icon={<BarChart3 size={22} />}
              title="Skill Progress Tracking"
              desc="Monitor your progress and development analytics."
            />

            <FeatureCard
              icon={<ShieldCheck size={22} />}
              title="Career Recommendation"
              desc="Find careers that align with your strengths and interests."
            />

          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section
        id="careers"
        className="py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">

          <div className="text-center mb-20">

            <p className="text-fuchsia-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Explore Career Paths
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Discover Tech Careers Matching
              <br />
              Your Interest
            </h2>

            <p className="text-slate-500 max-w-2xl mx-auto">
              Explore opportunities, average salaries, and required skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            <CareerCard icon={<Code2 />} title="Frontend Developer" salary="$5k/mo" />
            <CareerCard icon={<Database />} title="Backend Developer" salary="$6k/mo" />
            <CareerCard icon={<Palette />} title="UI/UX Designer" salary="$4k/mo" />
            <CareerCard icon={<LineChart />} title="Data Analyst" salary="$7k/mo" />
            <CareerCard icon={<Shield />} title="Cyber Security" salary="$8k/mo" />
            <CareerCard icon={<Smartphone />} title="Mobile Developer" salary="$6k/mo" />

          </div>
        </div>
      </section>

      {/* STEPS */}
      <section
        id="steps"
        className="py-28 px-5 md:px-8"
      >

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">

            <p className="text-fuchsia-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              How It Works
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Three Steps to Build Your Career
            </h2>

            <p className="text-slate-500">
              AI-powered tools designed to guide your future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <StepCard
              number="1"
              title="Take Assessment"
              desc="Complete personality and skills evaluation."
            />

            <StepCard
              number="2"
              title="Get Roadmap"
              desc="Receive a customized roadmap for your future."
            />

            <StepCard
              number="3"
              title="Learn & Complete"
              desc="Follow your roadmap and improve your skills."
            />

          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section
        id="dashboard"
        className="py-28 bg-white"
      >

        <div className="max-w-6xl mx-auto px-5 md:px-8">

          <div className="text-center mb-20">

            <p className="text-fuchsia-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Dashboard Showcase
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Your Personal Learning
              <br />
              Dashboard
            </h2>

            <p className="text-slate-500">
              Track your growth and analytics in one dashboard.
            </p>
          </div>

          <div className="bg-[#F7F8FC] rounded-[40px] p-8 border border-slate-100 shadow-xl">

            <div className="bg-white max-w-3xl mx-auto rounded-[30px] border border-slate-100 p-8 shadow-2xl shadow-indigo-100/40">

              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="font-bold text-xl">
                    Overview Analytics
                  </h3>

                  <p className="text-sm text-slate-400">
                    Track your learning progress
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-600 text-sm font-medium">
                    Skill Level
                  </button>

                  <button className="px-4 py-2 rounded-xl bg-fuchsia-100 text-fuchsia-600 text-sm font-medium">
                    Daily Goal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-5">

                <DashboardBar title="Logic" value="80%" />
                <DashboardBar title="Research" value="65%" />
                <DashboardBar title="Frontend" value="92%" />
                <DashboardBar title="Analytics" value="74%" />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-5 md:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <p className="text-fuchsia-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Success Stories
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Trusted by Thousands of
              <br />
              Students
            </h2>

            <p className="text-slate-500">
              See how GrowPath helped learners achieve success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <TestimonialCard
              name="Sarah Chen"
              role="Frontend Developer"
              quote="GrowPath gave me direction and helped me build my frontend career roadmap."
            />

            <TestimonialCard
              name="Michael Rodriguez"
              role="Data Analyst"
              quote="The AI assessment accurately matched my strengths and interests."
            />

            <TestimonialCard
              name="Emily Thompson"
              role="UI/UX Designer"
              quote="I finally found a roadmap that actually fits my learning goals."
            />

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 pb-28">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-600 rounded-[36px] px-8 py-20 text-center text-white shadow-2xl shadow-fuchsia-200">

          <p className="uppercase tracking-[0.2em] text-xs font-bold mb-5 opacity-80">
            Get Started Now
          </p>

          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Start Building Your
            <br />
            Future in Tech Today
          </h2>

          <p className="max-w-2xl mx-auto text-white/80 mb-10">
            Join thousands of learners discovering their future through AI-powered career guidance.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold hover:scale-105 transition-all"
          >
            Register Account
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#081126] text-white py-16 px-5 md:px-8">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>

              <h2 className="font-black text-xl">
                GrowPath
              </h2>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Helping students discover and pursue their ideal IT career path using AI-powered guidance.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={['Features', 'Roadmaps', 'Pricing', 'Advisory']}
          />

          <FooterColumn
            title="Company"
            links={['About', 'Careers', 'Contact', 'Services']}
          />

          <FooterColumn
            title="Legal"
            links={['Privacy Policy', 'Terms of Service', 'Cookies']}
          />

        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
          © 2026 GrowPath. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* COMPONENTS */

function ProgressItem({ title, percent, width, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-700">
          {title}
        </p>

        <span className="text-sm font-semibold text-slate-500">
          {percent}
        </span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-black mb-2">
        {value}
      </h3>

      <p className="text-slate-500 text-sm">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all"
    >

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-100 to-fuchsia-100 flex items-center justify-center text-indigo-600 mb-6">
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-slate-500 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function CareerCard({ icon, title, salary }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[28px] border border-slate-100 p-7 shadow-lg hover:shadow-2xl transition-all"
    >

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-100 to-fuchsia-100 text-indigo-600 flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="font-bold text-lg mb-2">
        {title}
      </h3>

      <p className="text-slate-500 text-sm mb-5">
        Career Path Recommendation
      </p>

      <div className="inline-flex px-4 py-2 rounded-xl bg-green-100 text-green-600 text-sm font-semibold">
        {salary}
      </div>
    </motion.div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 p-8 shadow-lg text-center">

      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center mx-auto mb-6 font-bold">
        {number}
      </div>

      <h3 className="font-bold text-xl mb-4">
        {title}
      </h3>

      <p className="text-slate-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function DashboardBar({ title, value }) {
  return (
    <div className="text-center">
      <div className="h-40 bg-gradient-to-t from-indigo-600 to-fuchsia-500 rounded-2xl flex items-end justify-center pb-4 text-white font-bold text-sm">
        {value}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-600">
        {title}
      </p>
    </div>
  );
}

function TestimonialCard({ name, role, quote }) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 p-8 shadow-lg">

      <div className="flex items-center gap-1 text-yellow-400 mb-6">
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
      </div>

      <p className="text-slate-600 leading-relaxed mb-8 italic">
        "{quote}"
      </p>

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"></div>

        <div>
          <h4 className="font-bold">
            {name}
          </h4>

          <p className="text-sm text-slate-500">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold mb-6">
        {title}
      </h4>

      <ul className="space-y-4 text-sm text-slate-400">

        {links.map((link) => (
          <li
            key={link}
            className="hover:text-white transition cursor-pointer"
          >
            {link}
          </li>
        ))}

      </ul>
    </div>
  );
}

