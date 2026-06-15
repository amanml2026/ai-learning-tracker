import { Course, DsaProblem, Note, CoachPlan, UserStats } from "../types";

// Seed data
export const DEFAULT_COURSES: Course[] = [
  {
    id: "c1",
    name: "Full Stack React & Tailwind Masterclass",
    platform: "Udemy",
    progressPercent: 75,
    status: "In Progress",
    updatedAt: "2026-06-13",
  },
  {
    id: "c2",
    name: "Data Structures & Algorithms in TypeScript",
    platform: "Coursera",
    progressPercent: 100,
    status: "Completed",
    updatedAt: "2026-06-12",
  },
  {
    id: "c3",
    name: "Advanced System Design Pattern",
    platform: "Leba",
    progressPercent: 0,
    status: "Not Started",
    updatedAt: "2026-06-10",
  },
];

export const DEFAULT_DSA_PROBLEMS: DsaProblem[] = [
  {
    id: "d1",
    name: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    dateSolved: "2026-06-10",
  },
  {
    id: "d2",
    name: "Longest Substring Without Repeating Characters",
    platform: "LeetCode",
    difficulty: "Medium",
    dateSolved: "2026-06-11",
  },
  {
    id: "d3",
    name: "Merge k Sorted Lists",
    platform: "LeetCode",
    difficulty: "Hard",
    dateSolved: "2026-06-13",
  },
  {
    id: "d4",
    name: "Validate Binary Search Tree",
    platform: "LeetCode",
    difficulty: "Medium",
    dateSolved: "2026-06-14",
  },
];

export const DEFAULT_NOTES: Note[] = [
  {
    id: "n1",
    title: "Big O Notation Cheat Sheet",
    content: "Quick reference for algorithm complexities:\n- **O(1)** Constant Time: Hash table lookup, array indexing.\n- **O(log n)** Logarithmic: Binary search, heap operations.\n- **O(n)** Linear: Single loop, copying array.\n- **O(n log n)** Linearithmic: Merge sort, Heap sort, Quick sort.\n- **O(n²)** Quadratic: Nested loops, bubble sort.\n- **O(2ⁿ)** Exponential: Recursive Fibonacci, TSP.",
    dateCreated: "2026-06-12T14:30:00Z",
    dateUpdated: "2026-06-12T14:35:00Z",
  },
  {
    id: "n2",
    title: "SQL vs NoSQL: Key Considerations",
    content: "When to choose which database architecture:\n\n**SQL (Relational - PostgreSQL, MySQL):**\n- Strict ACID compliance needs\n- Highly structured data schemas\n- Multi-row transactions or complex joins\n\n**NoSQL (Non-Relational - MongoDB, DynamoDB, Firestore):**\n- Unstructured or rapidly changing schemas\n- Massive read/write scale\n- Real-time JSON documents persistence models",
    dateCreated: "2026-06-13T10:00:00Z",
    dateUpdated: "2026-06-13T10:00:00Z",
  },
];

export const DEFAULT_STATS: UserStats = {
  enrollments: 3,
  completed: 1,
  dsaSolved: 4,
  studyStreak: 6,
  lastStudyDate: "2026-06-14", // matches current local time from prompt metadata
};

// LocalStorage Keys
const KEYS = {
  COURSES: "ai_tracker_courses",
  DSA: "ai_tracker_dsa",
  NOTES: "ai_tracker_notes",
  STATS: "ai_tracker_stats",
  COACH_PLANS: "ai_tracker_coach",
};

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Error reading localStorage key:", key, e);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing localStorage key:", key, e);
  }
}

// Initial hydration function
export function initializeStorage() {
  if (!localStorage.getItem(KEYS.COURSES)) {
    setStoredData(KEYS.COURSES, DEFAULT_COURSES);
  }
  if (!localStorage.getItem(KEYS.DSA)) {
    setStoredData(KEYS.DSA, DEFAULT_DSA_PROBLEMS);
  }
  if (!localStorage.getItem(KEYS.NOTES)) {
    setStoredData(KEYS.NOTES, DEFAULT_NOTES);
  }
  if (!localStorage.getItem(KEYS.STATS)) {
    setStoredData(KEYS.STATS, DEFAULT_STATS);
  }
}

export function fetchAll() {
  initializeStorage();
  return {
    courses: getStoredData<Course[]>(KEYS.COURSES, DEFAULT_COURSES),
    dsaProblems: getStoredData<DsaProblem[]>(KEYS.DSA, DEFAULT_DSA_PROBLEMS),
    notes: getStoredData<Note[]>(KEYS.NOTES, DEFAULT_NOTES),
    stats: getStoredData<UserStats>(KEYS.STATS, DEFAULT_STATS),
    coachPlans: getStoredData<CoachPlan[]>(KEYS.COACH_PLANS, []),
  };
}

export function saveAll(data: {
  courses: Course[];
  dsaProblems: DsaProblem[];
  notes: Note[];
  stats: UserStats;
  coachPlans?: CoachPlan[];
}) {
  setStoredData(KEYS.COURSES, data.courses);
  setStoredData(KEYS.DSA, data.dsaProblems);
  setStoredData(KEYS.NOTES, data.notes);
  setStoredData(KEYS.STATS, data.stats);
  if (data.coachPlans) {
    setStoredData(KEYS.COACH_PLANS, data.coachPlans);
  }
}

// Helper to calculate / tick stats
export function recalculateStats(courses: Course[], dsaProblems: DsaProblem[], stats: UserStats): UserStats {
  const completed = courses.filter((c) => c.status === "Completed" || c.progressPercent === 100).length;
  
  // Calculate study streak.
  // We can let the user manually bump trigger ("Mark study session for today") or increment dynamically on solves/add notes. Let's make it robust!
  // If the user did a study session today, update the streak. Let's provide a "Mark today as studied" button in addition, or trigger automatically on changes.
  
  return {
    ...stats,
    enrollments: courses.length,
    completed,
    dsaSolved: dsaProblems.length,
  };
}
