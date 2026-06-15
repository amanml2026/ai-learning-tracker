import React, { useMemo } from "react";
import { Course, DsaProblem, UserStats } from "../types";
import { 
  BookOpen, 
  CheckCircle, 
  Code, 
  Flame, 
  TrendingUp, 
  Calendar,
  Award,
  Plus
} from "lucide-react";
import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell
} from "recharts";

interface DashboardViewProps {
  courses: Course[];
  dsaProblems: DsaProblem[];
  stats: UserStats;
  onCheckIn: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({
  courses,
  dsaProblems,
  stats,
  onCheckIn,
  onNavigateToTab,
}: DashboardViewProps) {
  // Compute DSA difficulty counts
  const dsaBreakdown = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    dsaProblems.forEach((p) => {
      if (p.difficulty === "Easy") easy++;
      if (p.difficulty === "Medium") medium++;
      if (p.difficulty === "Hard") hard++;
    });
    return { easy, medium, hard, total: dsaProblems.length };
  }, [dsaProblems]);

  // Compute Courses progress stats
  const courseStats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter((c) => c.status === "Completed").length;
    const inProgress = courses.filter((c) => c.status === "In Progress").length;
    const avgProgress = total > 0 
      ? Math.round(courses.reduce((acc, c) => acc + c.progressPercent, 0) / total) 
      : 0;
    return { total, completed, inProgress, avgProgress };
  }, [courses]);

  // Chart Data 1: Courses progress distribution (Completed over time)
  const coursesCompletedOverTimeData = useMemo(() => {
    // Generate dates from past week/month or simply sort completed courses by compile dates
    // For visual aesthetic, we map existing courses progress
    const dates = ["Jun 09", "Jun 10", "Jun 11", "Jun 12", "Jun 13", "Jun 14"];
    return dates.map((date, idx) => {
      // Simulate cumulative completion curve based on dates
      let completedCount = 0;
      if (idx >= 1) completedCount = 1; // DSA completed
      if (idx >= 3) completedCount = 1; 
      if (idx >= 5) completedCount = courseStats.completed;
      return {
        date,
        Completed: completedCount,
        Enrolled: courseStats.total > 0 ? Math.min(courseStats.total, idx + 1) : 0,
      };
    });
  }, [courseStats]);

  // Chart Data 2: Problems Solved per week / Difficulty Chart
  const dsaDifficultyData = useMemo(() => {
    return [
      { name: "Easy", count: dsaBreakdown.easy, color: "#10B981" }, // emerald
      { name: "Medium", count: dsaBreakdown.medium, color: "#F59E0B" }, // amber
      { name: "Hard", count: dsaBreakdown.hard, color: "#EF4444" }, // red
    ];
  }, [dsaBreakdown]);

  // Determine if check-in for today has already been done
  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = stats.lastStudyDate === todayStr;

  // Render recent active courses
  const activeCourses = useMemo(() => {
    return courses.filter(c => c.status === "In Progress").slice(0, 3);
  }, [courses]);

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-100 to-violet-50 dark:from-slate-800 dark:to-indigo-950 p-6 rounded-2xl border border-indigo-200/50 dark:border-indigo-900/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-8">
            Welcome back, Learner! 👋
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-xl">
            You are on high-gear today. Keep track of your courses, catalog your solved DSA algorithms, and query your AI Coach for optimized schedules.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={onCheckIn}
            disabled={hasCheckedInToday}
            id="check-in-button"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
              hasCheckedInToday
                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 cursor-default"
                : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95"
            }`}
          >
            <Flame className={`h-4 w-4 ${hasCheckedInToday ? "fill-emerald-500 animate-pulse" : "fill-white"}`} />
            {hasCheckedInToday ? "Checked in Today!" : "Complete Study Session"}
          </button>
        </div>
      </div>

      {/* Grid of Key Numerical Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-grid">
        {/* Enrolled Courses */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Courses Active
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {courseStats.total}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {courseStats.inProgress} currently in progress
            </p>
          </div>
        </motion.div>

        {/* Completed Courses */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4"
        >
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Completed Courses
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {courseStats.completed}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              {courseStats.total > 0 ? Math.round((courseStats.completed / courseStats.total) * 100) : 0}% completion rate
            </p>
          </div>
        </motion.div>

        {/* DSA Solved */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4"
        >
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
            <Code className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              DSA Solved
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {dsaBreakdown.total}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              E: {dsaBreakdown.easy} | M: {dsaBreakdown.medium} | H: {dsaBreakdown.hard}
            </p>
          </div>
        </motion.div>

        {/* Study Streak */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4"
        >
          <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl text-red-600 dark:text-red-400">
            <Flame className="h-6 w-6 fill-red-500 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Study Streak
            </p>
            <div className="flex items-baseline space-x-1 mt-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.studyStreak}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">days</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last active: {stats.lastStudyDate || "Never"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Course & Progress Overview + Check-In Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Progress Columns */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Active Courses Progress
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your top in-progress studies
              </p>
            </div>
            <button 
              onClick={() => onNavigateToTab("courses")}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold select-none flex items-center gap-1 cursor-pointer"
            >
              Manage all <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {activeCourses.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                <BookOpen className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No active in-progress courses found</p>
                <div className="mt-3">
                  <button
                    onClick={() => onNavigateToTab("courses")}
                    className="text-xs font-semibold bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ) : (
              activeCourses.map((c) => (
                <div key={c.id} className="p-4 bg-gray-50/50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-snug line-clamp-1">
                        {c.name}
                      </h4>
                      <span className="inline-block mt-1 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                        {c.platform}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.progressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 7-Day Consistency check-in visual */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Weekly Attendance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Consistency builds memory muscles
            </p>
          </div>

          {/* Simulated 7-day grid of success status */}
          <div className="grid grid-cols-7 gap-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              // Highlight based on current streak count to make it look active
              const streakInDays = stats.studyStreak;
              const isStudied = (5 - i) < streakInDays; // mock indicator
              return (
                <div key={i} className="text-center space-y-1">
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">{day}</span>
                  <div 
                    className={`w-full aspect-square rounded-lg flex items-center justify-center border transition-all duration-300 ${
                      isStudied 
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-sm"
                        : "bg-gray-50 dark:bg-slate-950 border-gray-100 dark:border-slate-800"
                    }`}
                  >
                    {isStudied && <Flame className="h-4 w-4 fill-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-violet-50/50 dark:bg-indigo-950/20 border border-violet-100/50 dark:border-indigo-900/40 rounded-xl space-y-1 text-center">
            <h4 className="text-xs font-bold text-violet-800 dark:text-violet-400 flex items-center justify-center gap-1">
              <Award className="h-3 w-3" />
              Level Up Reward
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300">
              Study {Math.max(1, 10 - stats.studyStreak)} more consecutive days to earn the **DSA Elite** badge!
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="charts-container">
        {/* Course Completion Trends */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Enrolled vs Completed Growth
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cumulative courses completed over time
            </p>
          </div>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={coursesCompletedOverTimeData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px"
                  }} 
                />
                <Area type="monotone" dataKey="Enrolled" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorEnrolled)" />
                <Area type="monotone" dataKey="Completed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DSA Difficulty Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              DSA Difficulty Solved
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Breakdown of total solved algorithm problems
            </p>
          </div>
          <div className="h-64 mt-4 w-full">
            {dsaBreakdown.total === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-gray-100 dark:border-slate-800 rounded-xl">
                <Code className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solve first problem to draw graph</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dsaDifficultyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barSize={35}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px"
                    }} 
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {dsaDifficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
