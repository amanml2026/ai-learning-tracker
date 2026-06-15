import React, { useState, useEffect } from "react";
import { Course, DsaProblem, Note, CoachPlan, UserStats } from "./types";
import { fetchAll, saveAll, recalculateStats } from "./utils/db";
import { 
  Flame, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  GraduationCap, 
  Code, 
  StickyNote, 
  Sparkles,
  Menu,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Views
import DashboardView from "./components/DashboardView";
import CourseView from "./components/CourseView";
import DsaView from "./components/DsaView";
import NotesView from "./components/NotesView";
import CoachView from "./components/CoachView";

export default function App() {
  // App Core States
  const [courses, setCourses] = useState<Course[]>([]);
  const [dsaProblems, setDsaProblems] = useState<DsaProblem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<UserStats>({
    enrollments: 0,
    completed: 0,
    dsaSolved: 0,
    studyStreak: 0,
    lastStudyDate: "",
  });
  const [coachPlans, setCoachPlans] = useState<CoachPlan[]>([]);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("ai_tracker_dark_mode") === "true";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hydrate states on mounting
  useEffect(() => {
    const data = fetchAll();
    setCourses(data.courses);
    setDsaProblems(data.dsaProblems);
    setNotes(data.notes);
    setStats(data.stats);
    setCoachPlans(data.coachPlans);
  }, []);

  // Sync state changes to browser localStorage
  const syncAndSave = (
    newCourses: Course[],
    newDsa: DsaProblem[],
    newNotes: Note[],
    newStats: UserStats,
    newPlans?: CoachPlan[]
  ) => {
    const updatedStats = recalculateStats(newCourses, newDsa, newStats);
    setCourses(newCourses);
    setDsaProblems(newDsa);
    setNotes(newNotes);
    setStats(updatedStats);
    if (newPlans) {
      setCoachPlans(newPlans);
    }
    saveAll({
      courses: newCourses,
      dsaProblems: newDsa,
      notes: newNotes,
      stats: updatedStats,
      coachPlans: newPlans || coachPlans,
    });
  };

  // Dark mode trigger
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("ai_tracker_dark_mode", String(darkMode));
  }, [darkMode]);

  // Tab navigation helpers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Complete Study Session attendance incrementor
  const handleCheckIn = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Calculate if they already did check-in today
    if (stats.lastStudyDate === todayStr) return;

    let updatedStreak = stats.studyStreak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (stats.lastStudyDate === yesterdayStr) {
      // Studied consecutive day
      updatedStreak += 1;
    } else if (stats.lastStudyDate !== todayStr) {
      // Broke consecutive streak, reset or start from 1
      updatedStreak = Math.max(1, updatedStreak === 0 ? 1 : updatedStreak + 1);
    }

    const newStatsObj = {
      ...stats,
      studyStreak: updatedStreak,
      lastStudyDate: todayStr,
    };

    syncAndSave(courses, dsaProblems, notes, newStatsObj);
  };

  // Course handlers
  const handleAddCourse = (courseData: Omit<Course, "id" | "updatedAt">) => {
    const newCourse: Course = {
      ...courseData,
      id: "course_" + Date.now(),
      updatedAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newCourse, ...courses];
    syncAndSave(updated, dsaProblems, notes, stats);
  };

  const handleEditCourse = (edited: Course) => {
    const updated = courses.map((c) => (c.id === edited.id ? edited : c));
    syncAndSave(updated, dsaProblems, notes, stats);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm("Are you sure you want to remove this course syllabus?")) {
      const updated = courses.filter((c) => c.id !== id);
      syncAndSave(updated, dsaProblems, notes, stats);
    }
  };

  // DSA problem handlers
  const handleAddDsa = (dsaData: Omit<DsaProblem, "id">) => {
    const newProblem: DsaProblem = {
      ...dsaData,
      id: "dsa_" + Date.now(),
    };
    const updated = [newProblem, ...dsaProblems];
    syncAndSave(courses, updated, notes, stats);
  };

  const handleEditDsa = (edited: DsaProblem) => {
    const updated = dsaProblems.map((p) => (p.id === edited.id ? edited : p));
    syncAndSave(courses, updated, notes, stats);
  };

  const handleDeleteDsa = (id: string) => {
    if (window.confirm("Delete this logged solved problem?")) {
      const updated = dsaProblems.filter((p) => p.id !== id);
      syncAndSave(courses, updated, notes, stats);
    }
  };

  // Notes handlers
  const handleAddNote = (noteData: Omit<Note, "id" | "dateCreated" | "dateUpdated">) => {
    const nowIso = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: "note_" + Date.now(),
      dateCreated: nowIso,
      dateUpdated: nowIso,
    };
    const updated = [newNote, ...notes];
    syncAndSave(courses, dsaProblems, updated, stats);
  };

  const handleEditNote = (edited: Note) => {
    const updated = notes.map((n) => (n.id === edited.id ? edited : n));
    syncAndSave(courses, dsaProblems, updated, stats);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm("Delete this theoretical note block permanently?")) {
      const updated = notes.filter((n) => n.id !== id);
      syncAndSave(courses, dsaProblems, updated, stats);
    }
  };

  // Coach Plans handlers
  const handleAddCoachPlan = (newPlan: CoachPlan) => {
    const updatedPlans = [...coachPlans, newPlan];
    syncAndSave(courses, dsaProblems, notes, stats, updatedPlans);
  };

  // Sidebar Tabs Config
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses Enrolled", icon: GraduationCap },
    { id: "dsa", label: "LeetCode Registry", icon: Code },
    { id: "notes", label: "Notebook", icon: StickyNote },
    { id: "coach", label: "AI Study Coach", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-55/40 dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col md:flex-row relative">
      {/* 1. Desktop & Mobile Sticky Header for Mobile Menu controls */}
      <header className="md:hidden w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-850 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2.5 select-none" id="mobile-brand">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl text-white">
            <Sparkles className="h-5 w-5 fill-white/10" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-gray-950 dark:text-gray-100">AI Learning Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 2. Desktop Left Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 max-w-xs shrink-0 flex-col justify-between border-r border-gray-150/50 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 space-y-8 sticky top-0 h-screen select-none">
        <div className="space-y-6">
          {/* Brand/Launcher Details */}
          <div className="flex items-center space-x-3 select-none" id="desktop-brand">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-sm shadow-indigo-600/25">
              <Sparkles className="h-5 w-5 fill-white/15" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-gray-950 dark:text-gray-100">
                AI Learn Tracker
              </h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mt-0.5">
                Developer Engine
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-900/40"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-52 hover:text-gray-900 dark:hover:bg-slate-950/40 dark:hover:text-gray-100 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-450 dark:text-gray-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls: Streak & Light mode */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-850/60">
          <div className="flex items-center justify-between p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-950/30 rounded-xl">
            <span className="text-xs font-semibold text-gray-650 dark:text-gray-400 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
              Streak:
            </span>
            <span className="font-extrabold text-sm text-red-600 dark:text-red-400 font-mono">
              {stats.studyStreak} Days
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Theme Mode
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-gray-200/50 dark:border-slate-800/80 text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Mobile Navigation Drawers (Animated via AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between border-r border-gray-200 dark:border-slate-800"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span className="font-bold text-sm text-gray-950 dark:text-gray-100">AI Learn Tracker</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 bg-gray-50 dark:bg-slate-950 rounded-lg text-gray-400 hover:text-gray-500 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <nav className="space-y-1.5 pt-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-950"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 bg-red-55/30 border border-red-100 dark:border-slate-800 rounded-xl text-center space-y-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
                  <Flame className="h-4 w-4 text-red-500 fill-red-500" /> Current Daily Streak
                </span>
                <p className="font-extrabold text-base text-red-600 dark:text-red-400">{stats.studyStreak} days active</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Scrollable Container for Dynamic Panel Views */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "dashboard" && (
              <DashboardView
                courses={courses}
                dsaProblems={dsaProblems}
                stats={stats}
                onCheckIn={handleCheckIn}
                onNavigateToTab={handleTabChange}
              />
            )}
            {activeTab === "courses" && (
              <CourseView
                courses={courses}
                onAddCourse={handleAddCourse}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}
            {activeTab === "dsa" && (
              <DsaView
                dsaProblems={dsaProblems}
                onAddDsa={handleAddDsa}
                onEditDsa={handleEditDsa}
                onDeleteDsa={handleDeleteDsa}
              />
            )}
            {activeTab === "notes" && (
              <NotesView
                notes={notes}
                onAddNote={handleAddNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
              />
            )}
            {activeTab === "coach" && (
              <CoachView
                courses={courses}
                dsaProblems={dsaProblems}
                coachPlans={coachPlans}
                onAddCoachPlan={handleAddCoachPlan}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
