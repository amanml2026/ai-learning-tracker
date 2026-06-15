import React, { useState } from "react";
import { Note } from "../types";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  StickyNote,
  Calendar,
  Eye,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, "id" | "dateCreated" | "dateUpdated">) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesView({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: NotesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Read preview modal state
  const [activePreviewNote, setActivePreviewNote] = useState<Note | null>(null);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering preview modal
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      onEditNote({
        ...editingNote,
        title,
        content,
        dateUpdated: new Date().toISOString(),
      });
    } else {
      onAddNote({
        title,
        content,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering preview modal
    onDeleteNote(id);
  };

  const handleOpenPreview = (note: Note) => {
    setActivePreviewNote(note);
  };

  const filteredNotes = notes.filter((n) => {
    return (
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6" id="notes-section">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Theoretical Notebook
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Write customized markdown cheatsheets, syntax diagrams, interview prep, and coding architectures
          </p>
        </div>
        <button
          onClick={openAddModal}
          id="add-note-btn"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Note
        </button>
      </div>

      {/* Search notes bar */}
      <div className="relative bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search study blocks, system architecture cheat sheets, and code blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-notes-input"
          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200/80 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
      </div>

      {/* Sticky Note Cards Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-full mb-4">
            <StickyNote className="h-10 w-10 text-gray-300 dark:text-gray-700" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-300">No matching notes found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Create high-quality notes summarizing complex algorithms, API endpoints, or architecture strategies!
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="notes-grid">
          {filteredNotes.map((note) => (
            <motion.div
              layoutId={`note-card-${note.id}`}
              key={note.id}
              onClick={() => handleOpenPreview(note)}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 space-y-3"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 dark:text-white text-base tracking-tight leading-snug line-clamp-1">
                    {note.title}
                  </h3>
                  <StickyNote className="h-4 w-4 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-gray-650 dark:text-gray-350 leading-relaxed font-normal line-clamp-4 overflow-hidden whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-850 pt-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1 font-medium text-[10px]">
                  <Calendar className="h-3 w-3" />
                  {new Date(note.dateUpdated).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => openEditModal(note, e)}
                    className="p-1 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
                    title="Edit study note"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete study note"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingNote ? "Modify Notebook Entry" : "Create New Notebook Entry"}
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
                    Concept Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red-Black Trees Balancing Rules"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="note-title-field"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Content / Codeblock
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write details, key syntax mappings, or quick references. Markdown symbols are supported visually here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    id="note-content-field"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-sans text-sm resize-y"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-50 dark:border-slate-800/85 font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 text-center text-xs border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-850 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-note-btn"
                    className="flex-1 py-2 text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer"
                  >
                    {editingNote ? "Update" : "Save Study Block"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Overlay Modal */}
      <AnimatePresence>
        {activePreviewNote && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActivePreviewNote(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Ignore overlay closes
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {activePreviewNote.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    Notebook Study Card
                  </p>
                </div>
                <button
                  onClick={() => setActivePreviewNote(null)}
                  className="p-1.5 bg-gray-50 dark:bg-slate-950 rounded-lg text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="border-t border-b border-gray-50 dark:border-slate-850 py-4 max-h-[60vh] overflow-y-auto">
                {/* Visual rendering of headers & list symbols on content for high aesthetics */}
                <p className="white-space-pre-wrap leading-relaxed text-sm text-gray-700 dark:text-gray-300 font-sans whitespace-pre-wrap">
                  {activePreviewNote.content}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 pt-2">
                <span>Created: {new Date(activePreviewNote.dateCreated).toLocaleDateString()}</span>
                <span>Last Updated: {new Date(activePreviewNote.dateUpdated).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
