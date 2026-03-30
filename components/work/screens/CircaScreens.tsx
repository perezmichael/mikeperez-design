"use client";

/* Sanitized screen recreations for Apple Circa case study.
   All production names, personnel, and device data are fictional. */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared primitives ──────────────────────────────────────────── */
const s = {
  th:   "px-4 py-2.5 text-left font-mono text-[10px] tracking-widest uppercase text-white/30 border-b border-white/5",
  td:   "px-4 py-3 text-xs text-white/70 border-b border-white/5",
  pill: (color: string) => `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ${color}`,
  label: "font-mono text-[10px] tracking-widest uppercase text-white/30 mb-1",
};

const credColors: Record<string, string> = {
  "Crew":                 "bg-blue-500/10 text-blue-400",
  "Crew + Photo":         "bg-purple-500/10 text-purple-400",
  "Visitor":              "bg-amber-500/10 text-amber-400",
  "Contractor":           "bg-green-500/10 text-green-400",
  "Vendor":               "bg-rose-500/10 text-rose-400",
};

/* ── 1. Dashboard ───────────────────────────────────────────────── */
export function CircaDashboard() {
  return (
    <div className="bg-[#0f110e] h-[300px] flex flex-col text-white overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Circa</span>
        </div>
        <span className="font-mono text-[9px] text-white/20">Apple TV+ Production Security</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          { label: "Active Productions",  value: "12",   sub: "3 on location today",  accent: "text-green-400",  bg: "bg-green-500/5  border-green-500/10" },
          { label: "Credentialed Staff",  value: "847",  sub: "↑ 24 this week",        accent: "text-blue-400",   bg: "bg-blue-500/5   border-blue-500/10" },
          { label: "Detection Events",    value: "3",    sub: "Last 24 hours",         accent: "text-amber-400",  bg: "bg-amber-500/5  border-amber-500/10" },
        ].map((card) => (
          <div key={card.label} className={`rounded-lg border p-3 ${card.bg}`}>
            <p className={s.label}>{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.accent}`}>{card.value}</p>
            <p className="font-mono text-[9px] text-white/20 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="px-4 flex-1 overflow-hidden">
        <p className={s.label + " mb-2"}>Recent Activity</p>
        {[
          { event: "Badge issued",       name: "M. Torres",   prod: "Cascade",    time: "2m ago",  type: "Crew" },
          { event: "NFC scan detected",  name: "J. Reeves",   prod: "Silverline",  time: "14m ago", type: "Visitor" },
          { event: "Credential revoked", name: "S. Park",     prod: "Cascade",    time: "1h ago",  type: "Contractor" },
          { event: "Badge issued",       name: "L. Vance",    prod: "Nightfall",   time: "2h ago",  type: "Crew + Photo" },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
            <span className="text-[10px] text-white/50 w-[110px] shrink-0">{row.event}</span>
            <span className="text-[10px] text-white/70 flex-1">{row.name} · {row.prod}</span>
            <span className={s.pill(credColors[row.type] ?? "bg-white/5 text-white/30")}>{row.type}</span>
            <span className="font-mono text-[9px] text-white/20 shrink-0">{row.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. Projects Table (Interactive) ────────────────────────────── */
const projectStatuses = ["All", "Active", "Wrap", "Pre-Production"] as const;
type ProjectStatus = typeof projectStatuses[number];

const projects = [
  { name: "Cascade",    type: "Drama",      status: "Active",          personnel: 214, start: "Jan 06", end: "Jun 14", location: "Los Angeles" },
  { name: "Silverline", type: "Limited",    status: "Active",          personnel:  98, start: "Feb 12", end: "Apr 28", location: "New York"    },
  { name: "Nightfall",  type: "Feature",    status: "Pre-Production",  personnel:  36, start: "Apr 01", end: "Sep 30", location: "Atlanta"     },
  { name: "Ember",      type: "Drama",      status: "Wrap",            personnel: 187, start: "Sep 04", end: "Mar 21", location: "Los Angeles" },
  { name: "Prism",      type: "Animation",  status: "Active",          personnel:  52, start: "Nov 18", end: "Jul 31", location: "Remote"      },
];

export function CircaProjectsTable() {
  const [filter, setFilter] = useState<ProjectStatus>("All");

  const filtered = filter === "All" ? projects : projects.filter((p) => p.status === filter);

  const statusColor: Record<string, string> = {
    "Active":          "bg-green-500/10 text-green-400",
    "Wrap":            "bg-white/5 text-white/30",
    "Pre-Production":  "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="bg-[#0f110e] h-[320px] flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-xs font-medium">Productions</span>
        <div className="flex gap-1">
          {projectStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`font-mono text-[9px] px-2.5 py-1 rounded-md transition-all ${
                filter === status
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className={s.th}>Production</th>
              <th className={s.th}>Type</th>
              <th className={s.th}>Status</th>
              <th className={s.th}>Personnel</th>
              <th className={s.th}>Dates</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.tr
                  key={p.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className={s.td + " font-medium text-white/90"}>{p.name}</td>
                  <td className={s.td}>{p.type}</td>
                  <td className={s.td}>
                    <span className={s.pill(statusColor[p.status])}>{p.status}</span>
                  </td>
                  <td className={s.td + " font-mono"}>{p.personnel}</td>
                  <td className={s.td + " font-mono text-[9px] text-white/40"}>{p.start} → {p.end}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 3. Project Detail ──────────────────────────────────────────── */
const cascadePersonnel = [
  { name: "Marcus Torres",  role: "Director of Photography",  cred: "Crew + Photo",  status: "Active" },
  { name: "Yuki Sato",      role: "Production Designer",      cred: "Crew",          status: "Active" },
  { name: "Dana Park",      role: "On-Set Medic",             cred: "Crew",          status: "Active" },
  { name: "Luis Rivera",    role: "Equipment Vendor",         cred: "Vendor",        status: "Active" },
  { name: "Chris Malone",   role: "Press — THR",             cred: "Visitor",       status: "Expired" },
];

export function CircaProjectDetail() {
  return (
    <div className="bg-[#0f110e] h-[340px] flex flex-col text-white overflow-hidden">
      {/* Project header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium">Cascade</p>
            <p className="font-mono text-[9px] text-white/30">Drama · Los Angeles · Jan 06 – Jun 14</p>
          </div>
          <div className="flex gap-2">
            <button className="font-mono text-[9px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white/80 transition-colors">
              Print Badges
            </button>
            <button className="font-mono text-[9px] px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              + Add Personnel
            </button>
          </div>
        </div>
        {/* Cred type breakdown */}
        <div className="flex gap-2 mt-2.5">
          {[
            { type: "Crew",        count: 187 },
            { type: "Crew + Photo", count: 14 },
            { type: "Contractor",  count: 8  },
            { type: "Vendor",      count: 5  },
          ].map((c) => (
            <span key={c.type} className={`${s.pill(credColors[c.type] ?? "bg-white/5 text-white/30")} gap-1`}>
              {c.type} <span className="opacity-50">·</span> {c.count}
            </span>
          ))}
        </div>
      </div>

      {/* Personnel list */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className={s.th}>Name</th>
              <th className={s.th}>Role</th>
              <th className={s.th}>Credential</th>
              <th className={s.th}>Status</th>
              <th className={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {cascadePersonnel.map((p) => (
              <tr key={p.name} className="hover:bg-white/[0.02] cursor-pointer">
                <td className={s.td + " text-white/90"}>{p.name}</td>
                <td className={s.td}>{p.role}</td>
                <td className={s.td}>
                  <span className={s.pill(credColors[p.cred] ?? "bg-white/5 text-white/30")}>{p.cred}</span>
                </td>
                <td className={s.td}>
                  <span className={s.pill(p.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/20")}>
                    {p.status}
                  </span>
                </td>
                <td className={s.td}>
                  <button className="font-mono text-[9px] text-white/20 hover:text-white/60 transition-colors">Issue Badge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 4. Personnel Detail ────────────────────────────────────────── */
export function CircaPersonnelDetail() {
  const [credType, setCredType] = useState("Crew + Photo");

  return (
    <div className="bg-[#0f110e] h-[360px] flex flex-col text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
        <span className="text-xs font-medium">Personnel Detail</span>
        <button className="font-mono text-[9px] px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
          Print Badge
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: contact */}
        <div className="w-[45%] border-r border-white/10 p-4 space-y-3">
          {/* Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center font-mono text-sm text-white/60">
              MT
            </div>
            <div>
              <p className="text-xs font-medium">Marcus Torres</p>
              <p className="font-mono text-[9px] text-white/30">Director of Photography</p>
            </div>
          </div>
          {[
            { label: "Email",      value: "m.torres@email.com" },
            { label: "Phone",      value: "+1 (213) 555-0147"   },
            { label: "Vendor Co.", value: "Torres Visual LLC"   },
            { label: "Smart ID",   value: "SID-A4F92C"          },
          ].map((f) => (
            <div key={f.label}>
              <p className={s.label}>{f.label}</p>
              <p className="text-xs text-white/70">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Right: credential config */}
        <div className="flex-1 p-4 space-y-3">
          <div>
            <p className={s.label}>Credential Type</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.keys(credColors).map((type) => (
                <button
                  key={type}
                  onClick={() => setCredType(type)}
                  className={`${s.pill(credType === type ? credColors[type] : "bg-white/5 text-white/30")} cursor-pointer transition-all`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {[
            { label: "Production",    value: "Cascade" },
            { label: "Valid From",    value: "Jan 06, 2025" },
            { label: "Valid Until",   value: "Jun 14, 2025" },
          ].map((f) => (
            <div key={f.label}>
              <p className={s.label}>{f.label}</p>
              <div className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white/70">{f.value}</div>
            </div>
          ))}
          <div>
            <p className={s.label}>NFC Badge</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-4 bg-green-500/30 rounded-full flex items-center justify-end px-0.5">
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-green-400/70">Enabled · Tap to verify</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Device Management ───────────────────────────────────────── */
const devices = [
  { id: "RCV-001", mac: "3C:A5:51:2B:4F:8E", sim: "SIM-A91C", gps: "34.0522° N",  status: "Online",  project: "Cascade"   },
  { id: "RCV-002", mac: "A4:C3:F0:81:2D:7B", sim: "SIM-B33F", gps: "34.0541° N",  status: "Online",  project: "Cascade"   },
  { id: "RCV-003", mac: "7E:2B:9D:4A:C1:5F", sim: "SIM-C04E", gps: "40.7128° N",  status: "Online",  project: "Silverline" },
  { id: "RCV-004", mac: "B2:8E:17:F6:3C:90", sim: "SIM-D22A", gps: "N/A",          status: "Offline", project: "Nightfall" },
  { id: "RCV-005", mac: "64:9F:3A:0D:E8:12", sim: "SIM-E58B", gps: "33.7490° N",  status: "Online",  project: "Ember"     },
];

export function CircaDeviceManagement() {
  return (
    <div className="bg-[#0f110e] h-[300px] flex flex-col text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <span className="text-xs font-medium">Device Management</span>
          <span className="font-mono text-[9px] text-white/20 ml-3">NFC Receivers</span>
        </div>
        <button className="font-mono text-[9px] px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
          + Add Receiver
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className={s.th}>ID</th>
              <th className={s.th}>MAC Address</th>
              <th className={s.th}>SIM</th>
              <th className={s.th}>GPS</th>
              <th className={s.th}>Status</th>
              <th className={s.th}>Production</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id} className="hover:bg-white/[0.02] cursor-pointer">
                <td className={s.td + " font-mono text-white/90"}>{d.id}</td>
                <td className={s.td + " font-mono text-[9px] text-white/40"}>{d.mac}</td>
                <td className={s.td + " font-mono text-[9px] text-white/40"}>{d.sim}</td>
                <td className={s.td + " font-mono text-[9px] text-white/40"}>{d.gps}</td>
                <td className={s.td}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${d.status === "Online" ? "bg-green-400" : "bg-white/20"}`} />
                    <span className={`text-[10px] ${d.status === "Online" ? "text-green-400" : "text-white/30"}`}>{d.status}</span>
                  </div>
                </td>
                <td className={s.td}>{d.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 6. Personnel Management (Cross-project directory) ──────────── */
const allPersonnel = [
  { name: "Yuki Sato",     role: "Production Designer",  project: "Cascade",    cred: "Crew",          dept: "Art" },
  { name: "Dana Park",     role: "On-Set Medic",         project: "Silverline", cred: "Crew",          dept: "Medical" },
  { name: "Jordan Lee",    role: "Camera Operator",      project: "Cascade",    cred: "Crew + Photo",  dept: "Camera" },
  { name: "Sasha Patel",   role: "Press Journalist",     project: "Prism",      cred: "Visitor",       dept: "External" },
  { name: "Eli Nguyen",    role: "Electrical Contractor",project: "Nightfall",  cred: "Contractor",    dept: "G&E" },
];

export function CircaPersonnelManagement() {
  const [search, setSearch] = useState("");

  const filtered = allPersonnel.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0f110e] h-[300px] flex flex-col text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-xs font-medium">Personnel Directory</span>
        <button className="font-mono text-[9px] px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
          + Add Personnel
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-white/5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className={s.th}>Name</th>
              <th className={s.th}>Role</th>
              <th className={s.th}>Production</th>
              <th className={s.th}>Credential</th>
              <th className={s.th}>Dept</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.tr
                  key={p.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className={s.td + " text-white/90"}>{p.name}</td>
                  <td className={s.td}>{p.role}</td>
                  <td className={s.td + " text-white/50"}>{p.project}</td>
                  <td className={s.td}>
                    <span className={s.pill(credColors[p.cred] ?? "bg-white/5 text-white/30")}>{p.cred}</span>
                  </td>
                  <td className={s.td + " font-mono text-[9px] text-white/30"}>{p.dept}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center font-mono text-[10px] text-white/20">
                  No results for &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
