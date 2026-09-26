"use client";

import { useState } from "react";
import Link from "next/link";
import { Manrope } from "next/font/google";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  PhoneCall,
  RadioTower,
  Search,
  ShieldX,
  UserCheck,
} from "lucide-react";

const font = Manrope({ subsets: ["latin"] });

type Filter = "all" | "driver" | "manager";

const MODULES = [
  {
    id: "driver_comm",
    href: "/driver",
    step: 1,
    short: "Driver alert",
    title: "Driver Communication",
    subtitle: "Direct safety call to the driver",
    category: "driver" as const,
    badge: "Initial warning",
    description:
      "Direct warning call to the driver to stop speeding, mobile phone use or seatbelt violations before escalating.",
    audience: "Active field drivers",
    icon: UserCheck,
    bar: "bg-teal-500",
    tile: "bg-teal-50 text-teal-700",
    chip: "bg-teal-50 text-teal-800 ring-teal-200",
    num: "bg-teal-500",
    hover: "hover:ring-teal-500",
  },
  {
    id: "manager_comm",
    href: "/manager",
    step: 2,
    short: "Manager notice",
    title: "Manager Communication",
    subtitle: "First-stage escalation call",
    category: "manager" as const,
    badge: "Manager escalation",
    description:
      "Inform the vehicle manager about unresolved driver violations and ask them to act or counsel the driver.",
    audience: "Fleet and department managers",
    icon: PhoneCall,
    bar: "bg-amber-500",
    tile: "bg-amber-50 text-amber-700",
    chip: "bg-amber-50 text-amber-800 ring-amber-200",
    num: "bg-amber-500",
    hover: "hover:ring-amber-500",
  },
  {
    id: "followup_step3",
    href: "/follow-up",
    step: 3,
    short: "Follow-up check",
    title: "Follow-up Step 3",
    subtitle: "Compliance and re-check call",
    category: "manager" as const,
    badge: "Compliance follow-up",
    description:
      "Second check with the manager after counseling. Confirm whether violations dropped or the behavior continues.",
    audience: "Fleet and line managers",
    icon: Clock,
    bar: "bg-orange-500",
    tile: "bg-orange-50 text-orange-700",
    chip: "bg-orange-50 text-orange-800 ring-orange-200",
    num: "bg-orange-500",
    hover: "hover:ring-orange-500",
  },
  {
    id: "final_warning",
    href: "/last-warn",
    step: 4,
    short: "Final notice",
    title: "Final Warning",
    subtitle: "HR and department head escalation",
    category: "manager" as const,
    badge: "Urgent escalation",
    description:
      "Firm final warning for persistent offenders, with clear notice that a report is going to HR and the department head.",
    audience: "Senior management and HR",
    icon: ShieldX,
    bar: "bg-red-600",
    tile: "bg-red-50 text-red-700",
    chip: "bg-red-50 text-red-800 ring-red-200",
    num: "bg-red-600",
    hover: "hover:ring-red-500",
  },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const count = (f: Filter) =>
    f === "all" ? MODULES.length : MODULES.filter((m) => m.category === f).length;
  
  const list = MODULES.filter(
    (m) =>
      (filter === "all" || m.category === filter) &&
      `${m.title} ${m.description}`.toLowerCase().includes(q.trim().toLowerCase())
  );
  
  const tabs: [Filter, string][] = [
    ["all", "All calls"],
    ["driver", "Driver calls"],
    ["manager", "Manager calls"],
  ];

  return (
    <main className={`${font.className} min-h-screen bg-[#EDF1F5] text-[#12233B]`}>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#12233B] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500 text-[#12233B]">
            <RadioTower className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-extrabold leading-tight">Control Tower Hub</p>
            <p className="text-sm text-slate-300">Safety violation call scripts</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {/* Hero Section */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div>
            <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 ring-1 ring-teal-200">
              Standard operating procedure
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Call scripts and escalation workflow
            </h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
              Choose the call you are about to make to access standard scripts and escalation guidelines.
            </p>
          </div>

          {/* Escalation Path Stepper */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="mb-3 text-sm font-bold text-slate-500">Escalation path</h2>
            <ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {MODULES.map((m, i) => (
                <li key={m.id} className="contents">
                  <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white ${m.num}`}
                    >
                      {m.step}
                    </span>
                    <span className="text-sm font-bold">{m.short}</span>
                  </div>
                  {i < MODULES.length - 1 && (
                    <ChevronRight
                      className="hidden h-5 w-5 shrink-0 text-slate-300 sm:block"
                      aria-hidden
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Toolbar Filter & Search */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" className="inline-flex rounded-xl bg-white p-1 ring-1 ring-slate-200">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 ${
                  filter === key
                    ? "bg-[#12233B] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    filter === key ? "bg-white/20" : "bg-slate-100"
                  }`}
                >
                  {count(key)}
                </span>
              </button>
            ))}
          </div>
          <label className="relative block sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search workflow or keyword"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
        </section>

        {/* Workflow Cards */}
        {list.length === 0 ? (
          <p className="rounded-3xl bg-white p-12 text-center text-slate-500 ring-1 ring-slate-200">
            No workflow matches your search.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((m) => {
              const Icon = m.icon;
              return (
                <article
                  key={m.id}
                  className={`relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg ${m.hover}`}
                >
                  <div className={`h-1.5 ${m.bar}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${m.tile}`}>
                          <Icon className="h-7 w-7" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-500">
                            Step {m.step} · {m.short}
                          </p>
                          <h2 className="text-xl font-extrabold leading-tight">{m.title}</h2>
                        </div>
                      </div>
                      <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 sm:inline ${m.chip}`}>
                        {m.badge}
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-bold">{m.subtitle}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{m.description}</p>

                    <div className="mt-auto flex items-center justify-end border-t border-slate-100 pt-5">
                      <Link
                        href={m.href}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#12233B] px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                      >
                        Open script <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}