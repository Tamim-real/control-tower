"use client";

import { ReactNode, useState } from "react";
import { Manrope } from "next/font/google";
import {
  Gauge,
  GitBranch,
  Headset,
  Lightbulb,
  PhoneCall,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  UserCheck,
  UserRound,
  AlertTriangle,
  ShieldX,
} from "lucide-react";

const font = Manrope({ subsets: ["latin"] });

type DriverBranch = "apologetic" | "excuse" | "refusal" | null;

interface DriverViolationsState {
  mobile: boolean;
  passengerSeatbelt: boolean;
  driverSeatbelt: boolean;
  maxSpeed: boolean;
}

/* Filled value = red. Missing value = amber [placeholder] */
const Token = ({ v, ph }: { v: string; ph: string }) =>
  v.trim() ? (
    <span className="font-bold text-red-700">{v}</span>
  ) : (
    <span className="rounded bg-amber-100 px-1.5 font-bold text-amber-800">
      [{ph}]
    </span>
  );

/* One spoken line. "agent" = read aloud. "driver" = what the driver is expected to say. */
function Line({
  who,
  tag,
  children,
}: {
  who: "agent" | "driver";
  tag: string;
  children: ReactNode;
}) {
  const agent = who === "agent";
  return (
    <div className="relative pl-12">
      <span
        className={`absolute left-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full text-white ${
          agent ? "bg-red-600" : "bg-[#12233B]"
        }`}
      >
        {agent ? (
          <Headset className="h-5 w-5" />
        ) : (
          <UserRound className="h-5 w-5" />
        )}
      </span>
      <p className="mb-1 flex items-center gap-2 text-sm font-bold">
        {agent ? "You (Control Tower)" : "Driver"}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            agent ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {tag}
        </span>
      </p>
      <div
        className={`rounded-2xl p-4 leading-relaxed ${
          agent
            ? "rounded-tl-sm border border-red-200 bg-red-50 text-lg"
            : "rounded-tl-sm border border-slate-200 bg-slate-100 text-base text-slate-700"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

const Thread = ({ children }: { children: ReactNode }) => (
  <div className="relative space-y-5 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-0.5 before:bg-slate-200">
    {children}
  </div>
);

/* Alternative driver responses and handling */
function Alternatives({ items }: { items: { says: string; you: string }[] }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold">
        <GitBranch className="h-4 w-4 text-slate-500" /> If the driver says
        something else{" "}
        <span className="text-xs font-medium text-slate-500">
          (suggested handling)
        </span>
      </p>
      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={i.says}
            className="grid gap-1 text-sm sm:grid-cols-[200px_1fr] sm:gap-4"
          >
            <span className="font-semibold text-slate-700">
              &ldquo;{i.says}&rdquo;
            </span>
            <span className="text-slate-600">{i.you}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DriverWarningCallScript() {
  // Default values set as requested
  const [driver, setDriver] = useState("Mitthun Sharma");
  const [employeeId, setEmployeeId] = useState("10013897");
  const [licensePlate, setLicensePlate] = useState("2292-HRB");
  const [speed, setSpeed] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState<DriverBranch>(null);
  const [notes, setNotes] = useState("");

  // Default violations: mobile and maxSpeed are checked
  const [violations, setViolations] = useState<DriverViolationsState>({
    mobile: true,
    passengerSeatbelt: false,
    driverSeatbelt: false,
    maxSpeed: true,
  });

  const toggleViolation = (key: keyof DriverViolationsState) => {
    setViolations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setDriver("Mitthun Sharma");
    setEmployeeId("10013897");
    setLicensePlate("2292-HRB");
    setSpeed("");
    setPhone("");
    setViolations({
      mobile: true,
      passengerSeatbelt: false,
      driverSeatbelt: false,
      maxSpeed: true,
    });
    setBranch(null);
    setNotes("");
  };

  const input = (
    label: string,
    value: string,
    set: (v: string) => void,
    ph: string
  ) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={ph}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
      />
    </label>
  );

  const getSelectedViolationsText = () => {
    const list: string[] = [];
    if (violations.maxSpeed) list.push("speeding");
    if (violations.mobile) list.push("using mobile phone while driving");
    if (violations.driverSeatbelt) list.push("not wearing seatbelt");
    if (violations.passengerSeatbelt)
      list.push("passenger not wearing seatbelt");

    if (list.length === 0) return "safety violations";
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
  };

  const selectedViolationsSummary = getSelectedViolationsText();

  return (
    <main
      className={`${font.className} min-h-screen bg-[#EDF1F5] text-[#12233B]`}
    >
      {/* Header */}
      <header className="bg-[#12233B] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-600 text-white">
              <ShieldX className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold leading-tight">
                Control Tower Driver Warning Call Script
              </h1>
              <p className="text-sm text-slate-300">
                Direct Driver Communication · Safety Warning & Manager
                Escalation Notice
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Sidebar Form */}
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-sm font-bold text-red-600">
              Fill in before you call
            </h2>
            <div className="space-y-3">
              {input("Driver name", driver, setDriver, "Driver's name")}
              {input("Employee ID", employeeId, setEmployeeId, "e.g. EMP-9821")}
              {input(
                "License Plate / Vehicle No.",
                licensePlate,
                setLicensePlate,
                "e.g. KAZ-4820"
              )}

              {/* Violations Selection */}
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Violations observed
                </span>
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.mobile}
                      onChange={() => toggleViolation("mobile")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <span>Mobile Use</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.passengerSeatbelt}
                      onChange={() => toggleViolation("passengerSeatbelt")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <span>Passenger Seatbelt</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.driverSeatbelt}
                      onChange={() => toggleViolation("driverSeatbelt")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <span>Driver Seatbelt</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.maxSpeed}
                      onChange={() => toggleViolation("maxSpeed")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <span>Max Speed</span>
                  </label>
                </div>
              </div>

              {input(
                "Speeding detail (optional)",
                speed,
                setSpeed,
                "e.g. 85 km/h in a 60 zone"
              )}
              {input(
                "Phone use detail (optional)",
                phone,
                setPhone,
                "e.g. 3 events in 15 min"
              )}
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-slate-600">
              <span className="font-bold text-red-700">Red boxes</span> are yours
              to read aloud.{" "}
              <span className="font-bold text-slate-700">Grey boxes</span> are
              what the driver is expected to say.
            </p>
          </div>
        </aside>

        {/* Script Flow */}
        <div className="space-y-5">
          {/* Section 1: Greeting */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <Thread>
              <Line who="agent" tag="Read aloud">
                Hello <Token v={driver} ph="Driver's name" />, we are calling from
                Control Tower.
              </Line>
              <Line who="driver" tag="Expected reply">
                &ldquo;Yes, tell me. What happened?&rdquo;
              </Line>
            </Thread>
            <Alternatives
              items={[
                {
                  says: "I am driving now.",
                  you: "Say: Please park safely first or use hands-free, I need just 1 minute.",
                },
                {
                  says: "Who is this?",
                  you: "Say clearly: I am calling from Control Tower about your driving safety.",
                },
              ]}
            />
          </section>

          {/* Section 2: Violation Warning */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <Thread>
              <Line who="agent" tag="Read aloud - Easy & Clear Tone">
                <div className="space-y-3">
                  <p>
                    Recently, we saw that you did{" "}
                    <Token
                      v={selectedViolationsSummary}
                      ph="violations observed"
                    />{" "}
                    in vehicle <Token v={licensePlate} ph="Vehicle No." />.
                  </p>
                  <p className="font-semibold text-red-900">
                    You need to stop this immediately while driving.
                  </p>
                  <p>
                    If you do not stop this right now, we will inform your
                    manager for strict action.
                  </p>
                </div>
              </Line>
            </Thread>

            {/* Violation Badges */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.maxSpeed
                    ? "bg-red-50 text-red-700 ring-red-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <Gauge className="h-5 w-5" />
                <span className="text-sm font-semibold">Speeding</span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.mobile
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  Mobile Use While Driving
                </span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.driverSeatbelt
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  Driver Seatbelt Violation
                </span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.passengerSeatbelt
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <ShieldAlert className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  Passenger Seatbelt Violation
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Speak slowly and clearly. Listen to what the driver says, then click
              the matching option below.
            </p>
          </section>

          {/* Section 3: Driver Response Branching */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <p className="mb-3 text-sm font-semibold text-slate-600">
              Listen, then tap what the driver said:
            </p>
            <div className="space-y-3">
              {(
                [
                  [
                    "apologetic",
                    ShieldAlert,
                    "Sorry, I will be careful and follow the rules now.",
                  ],
                  [
                    "excuse",
                    AlertTriangle,
                    "I was in a hurry / I had an urgent call.",
                  ],
                  [
                    "refusal",
                    UserRound,
                    "I did not do this / Your system is wrong.",
                  ],
                ] as const
              ).map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setBranch(key)}
                  aria-pressed={branch === key}
                  className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 ${
                    branch === key
                      ? "bg-[#12233B] text-white ring-2 ring-[#12233B]"
                      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200/70"
                  }`}
                >
                  <UserRound className="h-5 w-5 shrink-0" />
                  <span className="flex-1 font-semibold">
                    &ldquo;{label}&rdquo;
                  </span>
                  <Icon className="h-5 w-5 shrink-0 opacity-70" />
                </button>
              ))}
            </div>

            {/* Branch 1 Response: Driver Apologizes */}
            {branch === "apologetic" && (
              <div className="mt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud">
                    <p>
                      Okay <Token v={driver} ph="Driver's name" />, good.
                      Please stay safe and follow all safety rules on every
                      trip.
                    </p>
                  </Line>
                </Thread>
              </div>
            )}

            {/* Branch 2 Response: Driver Makes Excuses */}
            {branch === "excuse" && (
              <div className="mt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud">
                    <p>
                      Safety is most important. Urgent work or hurry is not
                      allowed as an excuse. Please drive safely from now.
                    </p>
                  </Line>
                </Thread>
              </div>
            )}

            {/* Branch 3 Response: Driver Denies */}
            {branch === "refusal" && (
              <div className="mt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud">
                    <p>
                      Our system recorded this automatically. We will send the
                      full camera and system report to your manager.
                    </p>
                  </Line>
                </Thread>
              </div>
            )}
          </section>

          {/* Section 4: Closing & Farewell */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <Thread>
              <Line who="agent" tag="Read aloud">
                Thank you. Drive safely and have a good day.
              </Line>
              <Line who="driver" tag="Likely reply">
                &ldquo;Okay, thank you.&rdquo;
              </Line>
            </Thread>
            <p className="mt-4 text-sm text-slate-500">
              Let the driver hang up first, then write your call notes below.
            </p>
          </section>

          {/* Section 5: Call Notes & Reset */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-red-600">
                <PhoneCall className="h-5 w-5" /> Driver Call Notes
              </h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Driver's response, excuses given, or manager reporting status..."
              className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none placeholder:text-slate-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
            <button
              onClick={reset}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
            >
              <RotateCcw className="h-4 w-4" /> Reset for next driver call
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}