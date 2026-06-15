import React, { useState } from "react";
import { Course, DsaProblem, CoachPlan } from "../types";
import { 
  Sparkles, 
  Send, 
  Calendar, 
  AlertCircle,
  Clock,
  Zap,
  Target,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CoachViewProps {
  courses: Course[];
  dsaProblems: DsaProblem[];
  coachPlans: CoachPlan[];
  onAddCoachPlan: (plan: CoachPlan) => void;
}

export default function CoachView({
  courses,
  dsaProblems,
  coachPlans,
  onAddCoachPlan,
}: CoachViewProps) {
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active generating step messages
  const [loadingStep, setLoadingStep] = useState(0);

  // Parse markdown helper for basic styling without external MD dependencies to prevent crash issues
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mt-5 mb-2 flex items-center gap-1.5 border-b border-indigo-100 dark:border-indigo-950 pb-1">
            <Zap className="h-3.5 w-3.5" />
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-gray-900 dark:text-white mt-6 mb-3 border-l-4 border-indigo-600 pl-3.5">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={idx} className="text-lg font-black text-gray-950 dark:text-gray-100 mt-6 mb-4">
            {line.replace("# ", "")}
          </h2>
        );
      }
      // Bullet points
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleanText = line.replace(/^[-*]\s+/, "");
        // Check for bold parts **bold**
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = cleanText.split(boldRegex);
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-gray-700 dark:text-gray-300 py-1 leading-relaxed">
            {parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-gray-950 dark:text-white">{p}</strong> : p))}
          </li>
        );
      }
      // Regular sentence with possible bolding
      if (line.trim() !== "") {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = line.split(boldRegex);
        return (
          <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed py-1">
            {parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-gray-950 dark:text-white">{p}</strong> : p))}
          </p>
        );
      }
      return <div key={idx} className="h-2" />;
    });
  };

  const currentActivePlan = coachPlans[coachPlans.length - 1];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals.trim()) return;

    setLoading(true);
    setError(null);
    setLoadingStep(0);

    // Timed reassuring messages during generation
    const timer1 = setTimeout(() => setLoadingStep(1), 1500);
    const timer2 = setTimeout(() => setLoadingStep(2), 3500);
    const timer3 = setTimeout(() => setLoadingStep(3), 6000);

    try {
      // Extract brief courses and solved DSA info to pass to the helper
      const coursesBrief = courses
        .map((c) => `- ${c.name} on ${c.platform} (${c.progressPercent}% completed, status: ${c.status})`)
        .join("\n");
      const dsaBrief = `${dsaProblems.length} overall problems solved (Easy: ${dsaProblems.filter(p => p.difficulty === "Easy").length}, Medium: ${dsaProblems.filter(p => p.difficulty === "Medium").length}, Hard: ${dsaProblems.filter(p => p.difficulty === "Hard").length})`;

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals,
          coursesBrief,
          dsaBrief,
        }),
      });

      const data = await res.json();

      if (data.error && !data.fallback) {
        throw new Error(data.error);
      }

      onAddCoachPlan({
        goals: goals.trim(),
        studyPlan: data.studyPlan,
        motivationalQuote: data.motivationalQuote,
        createdAt: new Date().toISOString(),
      });
      setGoals("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="ai-coach-section">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md border border-indigo-700/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white shrink-0">
            <Sparkles className="h-6 w-6 animate-pulse text-indigo-200" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">AI Study Coach (Gemini 3.5 Flash)</h2>
            <p className="text-xs text-indigo-100 mt-1 max-w-2xl leading-relaxed">
              Formulate actionable curriculum tracks, resolve time scheduling blockages, and ask your virtual mentor for daily targets matched directly to your logged syllabus.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Goal Form / Input Block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Declare New Milestones
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Briefly describe your next 2-4 weeks targets (e.g., preparing for React Native positions, reviewing Big O, or cracking medium array-puzzles).
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <textarea
                  rows={5}
                  required
                  placeholder="e.g. I want to build solid backend projects over the next 3 weeks and tackle intermediate level array & heap problems on Leetcode. I have 2 hours daily."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  id="goals-textarea"
                  className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !goals.trim()}
                id="generate-coach-plan-btn"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {loading ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? "Counseling virtual brain..." : "Generate AI Strategy"}
              </button>
            </form>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Example Focuses
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Preparing for Frontend Technical Interviews",
                "Struggling with Dynamic Programming problems",
                "Learn state management and server architecture",
                "Need 15-day action plan for system design fundamentals",
              ].map((chip) => (
                <button
                  key={chip}
                  disabled={loading}
                  onClick={() => setGoals(chip)}
                  className="text-xs text-left px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-650 dark:text-gray-350 bg-gray-50 dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Render Result Plan */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center py-20 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-500 animate-spin" />
                  <Sparkles className="h-6 w-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Generating Custom Study Sequence
                  </h3>
                  
                  {/* Rotating status messages */}
                  <div className="h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadingStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider"
                      >
                        {loadingStep === 0 && "Parsing active syllabus database..."}
                        {loadingStep === 1 && "Aligning study milestones with solved DSA difficulty..."}
                        {loadingStep === 2 && "Compiling day-by-day Pomodoro cycles..."}
                        {loadingStep >= 3 && "Finalizing motivational encouragement package..."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Our server-side broker connects directly with the Gemini model to synthesize highly customized markdown planners based on your actual courses!
                </p>
              </motion.div>
            ) : currentActivePlan ? (
              <motion.div
                key="rendered-plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Motivation Quote header Card */}
                <div className="bg-indigo-50/50 dark:bg-slate-950/60 p-6 border-b border-gray-100 dark:border-slate-850 space-y-2">
                  <span className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-400 font-extrabold uppercase tracking-widest">
                    <Award className="h-3.5 w-3.5 fill-indigo-200" />
                    Coach's Word of Advice
                  </span>
                  <p className="italic text-gray-800 dark:text-gray-100 text-sm font-medium leading-relaxed font-sans pl-3 border-l-2 border-indigo-500">
                    "{currentActivePlan.motivationalQuote}"
                  </p>
                </div>

                {/* Plan Content */}
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-50 dark:border-slate-850 pb-3">
                    <span className="font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Generated Action Plan
                    </span>
                    <span>Created: {new Date(currentActivePlan.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-left">
                    {renderMarkdown(currentActivePlan.studyPlan)}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center py-20 flex flex-col items-center justify-center space-y-4"
              >
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full">
                  <Sparkles className="h-8 w-8 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    No active study schedule generated
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Write down your target study milestones in the panel on the left. The Coach reads your statistics to design perfect, sequential daily itineraries!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
