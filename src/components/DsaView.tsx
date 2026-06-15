import React, { useState } from "react";
import { DsaProblem, DsaDifficulty } from "../types";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Code,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DsaViewProps {
  dsaProblems: DsaProblem[];
  onAddDsa: (problem: Omit<DsaProblem, "id">) => void;
  onEditDsa: (problem: DsaProblem) => void;
  onDeleteDsa: (id: string) => void;
}

export default function DsaView({
  dsaProblems,
  onAddDsa,
  onEditDsa,
  onDeleteDsa,
}: DsaViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<DsaProblem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState<DsaDifficulty>("Easy");
  const [dateSolved, setDateSolved] = useState(() => new Date().toISOString().split("T")[0]);

  // Open modal for add
  const openAddModal = () => {
    setEditingProblem(null);
    setName("");
    setPlatform("LeetCode");
    setDifficulty("Easy");
    setDateSolved(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (prob: DsaProblem) => {
    setEditingProblem(prob);
    setName(prob.name);
    setPlatform(prob.platform);
    setDifficulty(prob.difficulty);
    setDateSolved(prob.dateSolved);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !platform.trim()) return;

    if (editingProblem) {
      onEditDsa({
        ...editingProblem,
        name,
        platform,
        difficulty,
        dateSolved,
      });
    } else {
      onAddDsa({
        name,
        platform,
        difficulty,
        dateSolved,
      });
    }
    setIsModalOpen(false);
  };

  // Difficulty counts
  const counts = dsaProblems.reduce(
    (acc, cur) => {
      acc[cur.difficulty]++;
      acc.total++;
      return acc;
    },
    { Easy: 0, Medium: 0, Hard: 0, total: 0 }
  );

  // Filter entries
  const filteredProblems = dsaProblems.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6" id="dsa-section">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            LeetCode & DSA Registry
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Log completed algorithmic assignments, track cumulative target counts, and organize difficult code-patterns
          </p>
        </div>
        <button
          onClick={openAddModal}
          id="add-problem-btn"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Log Problem
        </button>
      </div>

      {/* Difficulty stats breakdown widget */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: "Total Solved", count: counts.total, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50/50 dark:bg-indigo-950/20" },
          { name: "Easy Problems", count: counts.Easy, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50/50 dark:bg-emerald-950/20" },
          { name: "Medium Problems", count: counts.Medium, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50/50 dark:bg-amber-900/20" },
          { name: "Hard Problems", count: counts.Hard, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50/50 dark:bg-rose-950/20" },
        ].map((level, i) => (
          <div key={i} className={`p-4 rounded-xl border border-gray-100 dark:border-slate-800/80 ${level.bg} flex flex-col justify-between`}>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{level.name}</span>
            <span className={`text-xl font-extrabold mt-1.5 ${level.color}`}>{level.count}</span>
          </div>
        ))}
      </div>

      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems by name or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-problems-input"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200/80 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Filter:
          </span>
          {["All", "Easy", "Medium", "Hard"].map((difficultyValue) => (
            <button
              key={difficultyValue}
              onClick={() => setDifficultyFilter(difficultyValue)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                difficultyFilter === difficultyValue
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50"
                  : "bg-gray-50 dark:bg-slate-950 border border-gray-200/60 dark:border-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
            >
              {difficultyValue}
            </button>
          ))}
        </div>
      </div>

      {/* Solved Problems Records Table or Cards */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-full mb-4">
            <Code className="h-10 w-10 text-gray-300 dark:text-gray-700" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-300">No algorithm problems found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Log solutions to keep your metrics and cumulative analytics graphs correctly synchronized!
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Log First Problem
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden whitespace-nowrap" id="problems-table">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-55/70 dark:bg-slate-950/80 border-b border-gray-100 dark:border-slate-800/80 font-bold">
                <tr>
                  <th className="px-6 py-4">Problem Detail</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Date Completed</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-gray-800 dark:text-gray-100">
                {filteredProblems.map((prob) => {
                  // Style colors based on difficulty
                  const diffColor = {
                    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
                    Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
                    Hard: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
                  }[prob.difficulty];

                  return (
                    <tr key={prob.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4.5 font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="truncate max-w-xs">{prob.name}</span>
                      </td>
                      <td className="px-6 py-4.5 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                        {prob.platform}
                      </td>
                      <td className="px-6 py-4.5 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold tracking-wide border ${diffColor}`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-gray-500 dark:text-gray-400">
                        {prob.dateSolved}
                      </td>
                      <td className="px-6 py-4.5 text-right text-xs">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(prob)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDsa(prob.id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/25 text-rose-600 dark:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log DSA Modal */}
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
                  {editingProblem ? "Edit Logged Problem" : "Log Solved DSA Problem"}
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
                    Problem Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reverse Linked List, LRU Cache"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="dsa-name-field"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Platform
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LeetCode, Codeforces"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      id="dsa-platform-field"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as DsaDifficulty)}
                      id="dsa-difficulty-field"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-semibold cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Date Solved
                  </label>
                  <input
                    type="date"
                    required
                    value={dateSolved}
                    onChange={(e) => setDateSolved(e.target.value)}
                    id="dsa-date-field"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs font-mono"
                  />
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
                    id="save-dsa-btn"
                    className="flex-1 py-2 text-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer"
                  >
                    {editingProblem ? "Save Log" : "Log Solution"}
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
