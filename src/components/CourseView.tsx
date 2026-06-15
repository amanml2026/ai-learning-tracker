import React, { useState } from "react";
import { Course, CourseStatus } from "../types";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  BookOpen, 
  Check, 
  Play, 
  CircleDot,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CourseViewProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, "id" | "updatedAt">) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export default function CourseView({
  courses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}: CourseViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState<CourseStatus>("Not Started");

  // Open modal for add
  const openAddModal = () => {
    setEditingCourse(null);
    setName("");
    setPlatform("");
    setProgressPercent(0);
    setStatus("Not Started");
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setName(course.name);
    setPlatform(course.platform);
    setProgressPercent(course.progressPercent);
    setStatus(course.status);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !platform.trim()) return;

    if (editingCourse) {
      onEditCourse({
        ...editingCourse,
        name,
        platform,
        progressPercent,
        status,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    } else {
      onAddCourse({
        name,
        platform,
        progressPercent,
        status,
      });
    }
    setIsModalOpen(false);
  };

  // Intelligent syncing of percentage/status
  const handleProgressChange = (val: number) => {
    setProgressPercent(val);
    if (val === 100) {
      setStatus("Completed");
    } else if (val === 0) {
      setStatus("Not Started");
    } else {
      setStatus("In Progress");
    }
  };

  const handleStatusChange = (val: CourseStatus) => {
    setStatus(val);
    if (val === "Completed") {
      setProgressPercent(100);
    } else if (val === "Not Started") {
      setProgressPercent(0);
    } else if (progressPercent === 100 || progressPercent === 0) {
      setProgressPercent(50); // generic baseline in progress
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="course-section">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Course Syllabus Manager
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Catalog external learning courses, track percentage completions and certification status
          </p>
        </div>
        <button
          onClick={openAddModal}
          id="add-course-btn"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by name or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-courses-input"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200/80 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Status:
          </span>
          {["All", "Not Started", "In Progress", "Completed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50"
                  : "bg-gray-50 dark:bg-slate-950 border border-gray-200/60 dark:border-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List / Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-gray-300 dark:text-gray-700" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-300">No courses match your criteria</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Try revising your search string or add a new course syllabus to begin tracking!
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="course-cards-grid">
          {filteredCourses.map((course) => {
            // Colors based on course status
            const statusConfig = {
              "Completed": {
                icon: Check,
                badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
                barColor: "bg-emerald-500"
              },
              "In Progress": {
                icon: Play,
                badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
                barColor: "bg-indigo-600 dark:bg-indigo-500"
              },
              "Not Started": {
                icon: CircleDot,
                badgeBg: "bg-gray-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-slate-800",
                barColor: "bg-gray-300 dark:bg-slate-700"
              }
            }[course.status];

            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={course.id}
                layoutId={`course-card-${course.id}`}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
                      {course.platform}
                    </span>
                    <span className={`flex items-center gap-1 font-semibold text-xs px-2.5 py-0.5 rounded-full border ${statusConfig.badgeBg}`}>
                      <StatusIcon className="h-3 w-3" />
                      {course.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 dark:text-white text-base mt-2 tracking-tight leading-snug line-clamp-2">
                    {course.name}
                  </h3>
                </div>

                <div className="space-y-4 mt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Completion Percentage</span>
                      <span className="font-bold font-mono text-gray-800 dark:text-gray-200">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${statusConfig.barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progressPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/80 pt-3 text-xs text-gray-400">
                    <span>Updated {course.updatedAt}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(course)}
                        title="Edit course"
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-850 rounded-lg text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        title="Delete course"
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Overlay Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingCourse ? "Edit Course Syllabus" : "Add Course Syllabus"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-gray-50 dark:bg-slate-950 rounded-lg text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Course Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Algorithms in TypeScript"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="course-name-field"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Platform / Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LeetCode, Coursera, Udemy"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    id="course-platform-field"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value as CourseStatus)}
                      id="course-status-field"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs font-semibold cursor-pointer"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Percentage Completion
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={progressPercent}
                        onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                        id="course-progress-slider"
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="font-mono text-xs font-bold w-10 text-right dark:text-gray-200">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-50 dark:border-slate-800/85">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-850 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-course-btn"
                    className="flex-1 py-2 text-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer"
                  >
                    {editingCourse ? "Save Changes" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
