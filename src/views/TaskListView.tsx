import React, { useState, useMemo, useEffect } from "react";
import {
  ListChecks,
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  Circle,
  Clock,
  CheckCircle2,
  Zap,
  Briefcase,
  Star,
  ClipboardList,
} from "lucide-react";
import { AISignal, TradePosition } from "../types";

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "High" | "Medium" | "Low";
type TaskCategory = "Signal" | "Position" | "Watchlist" | "Review";

interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  due: string;
  symbol?: string;
}

interface TaskListViewProps {
  signals: AISignal[];
  positions: TradePosition[];
  favorites: string[];
}

const PRIORITY_RANK: Record<TaskPriority, number> = { High: 0, Medium: 1, Low: 2 };
const STATUS_RANK: Record<TaskStatus, number> = { Pending: 0, "In Progress": 1, Completed: 2 };

const categoryIcon: Record<TaskCategory, React.FC<{ className?: string }>> = {
  Signal: Zap,
  Position: Briefcase,
  Watchlist: Star,
  Review: ClipboardList,
};

export const TaskListView: React.FC<TaskListViewProps> = ({ signals, positions, favorites }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "status" | "due">("priority");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "All">("All");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "All">("All");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("Medium");
  const [newDue, setNewDue] = useState("Today");

  // Seed tracked items from live app data (signals, positions, watchlist)
  useEffect(() => {
    const seeded: Task[] = [];

    signals.forEach((sig) => {
      seeded.push({
        id: `sig-${sig.id}`,
        title: `Execute ${sig.type} signal on ${sig.symbol}`,
        category: "Signal",
        priority: sig.confidence >= 80 ? "High" : sig.confidence >= 70 ? "Medium" : "Low",
        status: sig.status === "WIN" ? "Completed" : "Pending",
        due: sig.timeframe,
        symbol: sig.symbol,
      });
    });

    positions.forEach((pos) => {
      seeded.push({
        id: `pos-${pos.id}`,
        title: `Monitor ${pos.symbol} ${pos.type} position`,
        category: "Position",
        priority: "High",
        status: pos.status === "OPEN" ? "In Progress" : "Completed",
        due: pos.expirationTime,
        symbol: pos.symbol,
      });
    });

    favorites.forEach((sym) => {
      seeded.push({
        id: `watch-${sym}`,
        title: `Review ${sym} setup & set price alerts`,
        category: "Watchlist",
        priority: "Medium",
        status: "Pending",
        due: "Today",
        symbol: sym,
      });
    });

    seeded.push({
      id: "review-weekly",
      title: "Weekly portfolio risk audit",
      category: "Review",
      priority: "Low",
      status: "Pending",
      due: "Friday",
    });

    setTasks(seeded);
    // Only seed once from the initial prop snapshot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    setTasks((prev) => [
      {
        id: `task-${Date.now()}`,
        title,
        category: "Review",
        priority: newPriority,
        status: "Pending",
        due: newDue || "Today",
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewPriority("Medium");
    setNewDue("Today");
  };

  const cycleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Record<TaskStatus, TaskStatus> = {
          Pending: "In Progress",
          "In Progress": "Completed",
          Completed: "Pending",
        };
        return { ...t, status: next[t.status] };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => (filterCategory === "All" ? true : t.category === filterCategory))
      .filter((t) => (filterStatus === "All" ? true : t.status === filterStatus))
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "priority") return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        if (sortBy === "status") return STATUS_RANK[a.status] - STATUS_RANK[b.status];
        return String(a.due).localeCompare(String(b.due));
      });
  }, [tasks, filterCategory, filterStatus, search, sortBy]);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "Pending").length,
      progress: tasks.filter((t) => t.status === "In Progress").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    }),
    [tasks]
  );

  const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-lg space-y-1">
      <span className="text-xs text-slate-400">{label}</span>
      <div className={`text-xl font-extrabold font-mono ${color}`}>{value}</div>
    </div>
  );

  const statusBadge = (status: TaskStatus) => {
    const map: Record<TaskStatus, string> = {
      Pending: "bg-amber-950 text-amber-400 border-amber-500/30",
      "In Progress": "bg-sky-950 text-sky-400 border-sky-500/30",
      Completed: "bg-emerald-950 text-emerald-400 border-emerald-500/30",
    };
    return map[status];
  };

  const priorityDot = (priority: TaskPriority) => {
    const map: Record<TaskPriority, string> = {
      High: "bg-rose-500",
      Medium: "bg-amber-500",
      Low: "bg-slate-500",
    };
    return map[priority];
  };

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-5 font-sans">
      {/* Header */}
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <ListChecks className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Trading Task List</h1>
            <p className="text-xs text-slate-400">View, sort and organize every item your application tracks</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={counts.total} color="text-slate-100" />
        <StatCard label="Pending" value={counts.pending} color="text-amber-400" />
        <StatCard label="In Progress" value={counts.progress} color="text-sky-400" />
        <StatCard label="Completed" value={counts.completed} color="text-emerald-400" />
      </div>

      {/* Add task + filters */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
            className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="text"
            value={newDue}
            onChange={(e) => setNewDue(e.target.value)}
            placeholder="Due"
            className="w-24 bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex items-center space-x-2 bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 bg-transparent text-xs text-slate-100 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
              <option value="due">Sort: Due</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as TaskCategory | "All")}
              className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Signal">Signal</option>
              <option value="Position">Position</option>
              <option value="Watchlist">Watchlist</option>
              <option value="Review">Review</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "All")}
              className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-2 shadow-xl space-y-1">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs">
            No tasks match your filters.
          </div>
        ) : (
          filtered.map((task) => {
            const Icon = categoryIcon[task.category];
            return (
              <div
                key={task.id}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#161b22] transition-colors"
              >
                <button
                  onClick={() => cycleStatus(task.id)}
                  title="Cycle status"
                  className="shrink-0"
                >
                  {task.status === "Completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : task.status === "In Progress" ? (
                    <Clock className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                  )}
                </button>

                <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot(task.priority)}`} title={`${task.priority} priority`} />

                <Icon className="w-4 h-4 text-slate-500 shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate ${task.status === "Completed" ? "line-through text-slate-500" : "text-slate-100"}`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span>{task.category}</span>
                    {task.symbol && <span className="font-mono text-slate-300">· {task.symbol}</span>}
                    <span className="font-mono">· due {task.due}</span>
                  </div>
                </div>

                <span className={`shrink-0 px-2 py-0.5 rounded border text-[10px] font-bold ${statusBadge(task.status)}`}>
                  {task.status}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
