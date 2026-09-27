'use client';
import React, { useState } from "react";
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
  ShieldX,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle
} from "lucide-react";

type Branch = "direct_action" | "counselled" | "will_talk" | null;

interface ViolationsState {
  mobile: boolean;
  passengerSeatbelt: boolean;
  driverSeatbelt: boolean;
  maxSpeed: boolean;
}

/* Dynamic highlight token: Filled value = red text, missing value = amber placeholder pill */
const Token = ({ v, ph }: { v: string; ph: string }) =>
  v.trim() ? (
    <span className="font-extrabold text-red-600 underline decoration-red-300 underline-offset-2">
      {v}
    </span>
  ) : (
    <span className="inline-block rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800 border border-amber-300 animate-pulse text-xs">
      [{ph}]
    </span>
  );

/* Dialog Line Component */
function Line({
  who,
  tag,
  children,
}: {
  who: "agent" | "manager";
  tag: string;
  children: React.ReactNode;
}) {
  const agent = who === "agent";
  return (
    <div className="relative pl-12">
      <span
        className={`absolute left-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full text-white shadow-sm transition-transform hover:scale-105 ${
          agent ? "bg-red-600 ring-4 ring-red-100" : "bg-[#12233B] ring-4 ring-slate-200"
        }`}
      >
        {agent ? <Headset className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
      </span>
      <p className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
        <span className={agent ? "text-red-700" : "text-slate-800"}>
          {agent ? "You (Control Tower)" : "Manager"}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-normal ${
            agent ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {tag}
        </span>
      </p>
      <div
        className={`rounded-2xl p-4 leading-relaxed shadow-sm transition-all ${
          agent
            ? "rounded-tl-sm border border-red-200 bg-red-50/90 text-slate-900 text-base font-medium"
            : "rounded-tl-sm border border-slate-200 bg-slate-100 text-sm text-slate-700"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* Timeline Thread Component */
const Thread = ({ children }: { children: React.ReactNode }) => (
  <div className="relative space-y-5 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-0.5 before:bg-slate-200">
    {children}
  </div>
);

/* Alternative Manager Responses Collapsible/Card Component */
function Alternatives({ items }: { items: { says: string; you: string }[] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
          <GitBranch className="h-4 w-4 text-slate-500" /> If the manager says something else
          <span className="text-[11px] font-normal normal-case text-slate-500">(suggested handling)</span>
        </p>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        )}
      </button>
      
      {isOpen && (
        <ul className="mt-3 space-y-3 border-t border-slate-200/80 pt-3">
          {items.map((i, idx) => (
            <li key={idx} className="grid gap-1 text-sm sm:grid-cols-[180px_1fr] sm:gap-4">
              <span className="font-semibold text-slate-700">&ldquo;{i.says}&rdquo;</span>
              <span className="text-slate-600 bg-white p-2 rounded-lg border border-slate-200 text-xs sm:text-sm">
                {i.you}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [manager, setManager] = useState("Fahad Alshehri");
  const [driver, setDriver] = useState("Mitthun Sharma");
  const [employeeId, setEmployeeId] = useState("10013897");
  const [licensePlate, setLicensePlate] = useState("2292-HRB");
  const [speed, setSpeed] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState<Branch>(null);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const [violations, setViolations] = useState<ViolationsState>({
    mobile: true,
    passengerSeatbelt: false,
    driverSeatbelt: false,
    maxSpeed: true,
  });

  const toggleViolation = (key: keyof ViolationsState) => {
    setViolations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setManager("");
    setDriver("");
    setEmployeeId("");
    setLicensePlate("");
    setSpeed("");
    setPhone("");
    setViolations({
      mobile: false,
      passengerSeatbelt: false,
      driverSeatbelt: false,
      maxSpeed: false,
    });
    setBranch(null);
    setNotes("");
    setCopied(false);
  };

  const copyNotesToClipboard = () => {
    const summary = `
--- CONTROL TOWER FINAL WARNING CALL SUMMARY ---
Manager: ${manager || "N/A"}
Driver: ${driver || "N/A"} (ID: ${employeeId || "N/A"})
Vehicle: ${licensePlate || "N/A"}
Violations: ${selectedViolationsSummary}
${speed ? `Speed details: ${speed}` : ""}
${phone ? `Phone details: ${phone}` : ""}
Branch Action Taken: ${
      branch === "direct_action"
        ? "Manager took direct responsibility"
        : branch === "counselled"
        ? "Manager offered soft counseling (Final Warning Issued)"
        : branch === "will_talk"
        ? "Escalated to HR/Department Head"
        : "Not selected"
    }
Call Notes: ${notes || "None"}
-----------------------------------------------
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputField = (
    label: string,
    value: string,
    set: (v: string) => void,
    ph: string,
    type = "text"
  ) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={ph}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
      />
    </label>
  );

  /* Construct dynamic text for violation summary */
  const getSelectedViolationsText = () => {
    const list: string[] = [];
    if (violations.maxSpeed) list.push(`speeding${speed ? ` (${speed})` : ""}`);
    if (violations.mobile) list.push(`using phone while driving${phone ? ` (${phone})` : ""}`);
    if (violations.driverSeatbelt) list.push("not wearing driver seatbelt");
    if (violations.passengerSeatbelt) list.push("passenger seatbelt violation");

    if (list.length === 0) return "repeated safety violations";
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
  };

  const selectedViolationsSummary = getSelectedViolationsText();

  return (
    <main className="min-h-screen bg-[#EDF1F5] font-sans text-[#12233B] antialiased selection:bg-red-200 selection:text-red-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#12233B] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 text-white shadow-inner">
              <ShieldX className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-base font-extrabold leading-tight sm:text-lg">
                Control Tower Final Warning Call Script
              </h1>
              <p className="text-xs text-slate-300">
                Unresolved Safety Violations · Strict Warning &amp; HR Escalation Notice
              </p>
            </div>
          </div>
          <button
            onClick={reset}
            title="Reset for next warning call"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset for next warning call</span>
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        
        {}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                1. Pre-Call Details
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded">
                Required
              </span>
            </div>
            
            <div className="space-y-3">
              {inputField("Manager Name", manager, setManager, "e.g. John Smith")}
              {inputField("Driver Name", driver, setDriver, "e.g. Alex Johnson")}
              {inputField("Employee ID", employeeId, setEmployeeId, "e.g. EMP-9821")}
              {inputField("License Plate / Vehicle No.", licensePlate, setLicensePlate, "e.g. KAZ-4820")}

              {/* Checkboxes for Observed Violations */}
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Observed Violations
                </span>
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={violations.maxSpeed}
                      onChange={() => toggleViolation("maxSpeed")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <Gauge className="h-4 w-4 text-slate-500" />
                    <span>Max Speeding Violation</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={violations.mobile}
                      onChange={() => toggleViolation("mobile")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <Smartphone className="h-4 w-4 text-slate-500" />
                    <span>Mobile Use While Driving</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={violations.driverSeatbelt}
                      onChange={() => toggleViolation("driverSeatbelt")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <UserCheck className="h-4 w-4 text-slate-500" />
                    <span>Driver Seatbelt Off</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={violations.passengerSeatbelt}
                      onChange={() => toggleViolation("passengerSeatbelt")}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <ShieldAlert className="h-4 w-4 text-slate-500" />
                    <span>Passenger Seatbelt Violation</span>
                  </label>
                </div>
              </div>

              {/* Optional detail inputs */}
              {violations.maxSpeed &&
                inputField("Speed Detail (optional)", speed, setSpeed, "e.g. 85 km/h in a 60 zone")}
              {violations.mobile &&
                inputField("Phone Detail (optional)", phone, setPhone, "e.g. 3 events in 15 min")}
            </div>
          </section>

          {/* Quick guide helper */}
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 p-3.5 text-xs ring-1 ring-amber-200/70">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="leading-relaxed text-amber-900">
              <strong className="text-red-700">Red boxes</strong> are yours to read aloud.{" "}
              <strong className="text-slate-800">Grey boxes</strong> indicate what the manager is expected to respond.
            </p>
          </div>
        </aside>

        {}
        <div className="space-y-5">
          
          {/* SECTION 1: Greeting */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Step 1: Introduction &amp; Verification
              </span>
            </div>
            
            <Thread>
              <Line who="agent" tag="Read aloud">
                Hello, good day! This is Sakib calling from the Control Tower. Am I speaking with{" "}
                <Token v={manager} ph="Manager's name" />?
              </Line>
              <Line who="manager" tag="Expected reply">
                &ldquo;Yes, speaking. How can I help you?&rdquo;
              </Line>
            </Thread>

            <Alternatives
              items={[
                {
                  says: "Who is this?",
                  you: "Politely state your name and clarify that you are calling from the Control Tower regarding an urgent safety concern.",
                },
                {
                  says: "I am not the manager.",
                  you: "Politely ask for the correct manager's name and when you can reach them. Do not disclose safety violation details to unauthorized staff.",
                },
                {
                  says: "I am busy right now.",
                  you: "Emphasize that this is an urgent safety warning call and request just 60 seconds of their time.",
                },
              ]}
            />
          </section>

          {/* SECTION 2: Warning Reason & Dynamic Badges */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Step 2: State Unresolved Violations &amp; HR Warning
              </span>
            </div>

            <Thread>
              <Line who="agent" tag="Read aloud - Firm Tone">
                <div className="space-y-3">
                  <p>
                    I am calling regarding driver <Token v={driver} ph="Driver's name" /> (ID:{" "}
                    <Token v={employeeId} ph="Employee ID" />), operating vehicle{" "}
                    <Token v={licensePlate} ph="Vehicle No." />.
                  </p>
                  <p className="font-semibold text-red-950 bg-red-100/70 p-2.5 rounded-lg border border-red-200">
                    This driver is not correcting their safety violations. Despite previous warnings, we are still recording{" "}
                    <Token v={selectedViolationsSummary} ph="violations observed" />.
                  </p>
                  <p>
                    If this is not resolved immediately on your end, we will have to escalate this directly to your{" "}
                    <strong>Department Head and HR</strong> for formal disciplinary action.
                  </p>
                </div>
              </Line>
            </Thread>

            {/* Violation Status Visual Badges */}
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 transition-all ${
                  violations.maxSpeed
                    ? "bg-red-50 text-red-800 ring-red-300 font-bold shadow-sm"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <Gauge className={`h-5 w-5 ${violations.maxSpeed ? "text-red-600" : ""}`} />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-sm">Continuous Speeding</span>
                  {violations.maxSpeed && speed ? (
                    <span className="text-red-600">{speed}</span>
                  ) : (
                    <span>{violations.maxSpeed ? "Active Violation" : "Not Flagged"}</span>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 transition-all ${
                  violations.mobile
                    ? "bg-amber-50 text-amber-900 ring-amber-300 font-bold shadow-sm"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <Smartphone className={`h-5 w-5 ${violations.mobile ? "text-amber-600" : ""}`} />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-sm">Phone Use While Driving</span>
                  {violations.mobile && phone ? (
                    <span className="text-amber-700">{phone}</span>
                  ) : (
                    <span>{violations.mobile ? "Active Violation" : "Not Flagged"}</span>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 transition-all ${
                  violations.driverSeatbelt
                    ? "bg-amber-50 text-amber-900 ring-amber-300 font-bold shadow-sm"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <UserCheck className={`h-5 w-5 ${violations.driverSeatbelt ? "text-amber-600" : ""}`} />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-sm">Driver Seatbelt Violation</span>
                  <span>{violations.driverSeatbelt ? "Active Violation" : "Not Flagged"}</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 transition-all ${
                  violations.passengerSeatbelt
                    ? "bg-amber-50 text-amber-900 ring-amber-300 font-bold shadow-sm"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <ShieldAlert className={`h-5 w-5 ${violations.passengerSeatbelt ? "text-amber-600" : ""}`} />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-sm">Passenger Seatbelt Violation</span>
                  <span>{violations.passengerSeatbelt ? "Active Violation" : "Not Flagged"}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 italic">
              * Select the corresponding response pathway below depending on how the manager answers.
            </p>
          </section>

          {}
          {/* SECTION 3: Response Branching */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Step 3: Manager Response Branching
              </span>
            </div>

            <p className="mb-3 text-sm font-semibold text-slate-700">
              Listen to the manager&apos;s answer, then select an option:
            </p>
            
            <div className="space-y-2.5">
              {(
                [
                  [
                    "direct_action",
                    ShieldAlert,
                    "Okay, I will personally handle this now. The driver will not repeat this violation.",
                    "Direct Manager Commitment",
                  ],
                  [
                    "counselled",
                    AlertTriangle,
                    "I spoke to him before, and I will talk to him again.",
                    "Weak Commitment / Repeat Counseling",
                  ],
                  [
                    "will_talk",
                    UserRound,
                    "Do whatever you want / Go ahead and inform HR.",
                    "Escalation Approved / Refusal to act",
                  ],
                ] as const
              ).map(([key, Icon, label, badge]) => (
                <button
                  key={key}
                  onClick={() => setBranch(key)}
                  aria-pressed={branch === key}
                  className={`group relative flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl p-4 text-left transition-all ${
                    branch === key
                      ? "bg-[#12233B] text-white ring-2 ring-[#12233B] shadow-md"
                      : "bg-slate-100/80 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <UserRound className={`h-5 w-5 shrink-0 mt-0.5 ${branch === key ? "text-red-400" : "text-slate-500"}`} />
                    <div>
                      <span className="block font-semibold text-sm sm:text-base">&ldquo;{label}&rdquo;</span>
                      <span className={`text-xs font-medium ${branch === key ? "text-slate-300" : "text-slate-500"}`}>
                        {badge}
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-5 w-5 shrink-0 self-end sm:self-center ${branch === key ? "text-red-400" : "opacity-50"}`} />
                </button>
              ))}
            </div>

            {/* BRANCH 1: Direct Action */}
            {branch === "direct_action" && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud - Constructive Tone">
                    <p>
                      Thank you very much, <Token v={manager} ph="Manager's name" />. We appreciate your direct involvement in maintaining fleet safety.
                    </p>
                    <p className="mt-2">
                      Since you are personally taking charge of this, we will hold off on HR escalation for now and will closely monitor the vehicle&apos;s trip logs over the next few days.
                    </p>
                  </Line>
                </Thread>
              </div>
            )}

            {/* BRANCH 2: Weak Commitment / Counselled */}
            {branch === "counselled" && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud - Strict Tone">
                    <p>
                      Thank you, <Token v={manager} ph="Manager's name" />. Please note that this serves as the final verbal warning, as general counseling has not resolved the issue.
                    </p>
                    <p className="mt-2">
                      If any further violations are logged by Control Tower, an official incident report will be transmitted directly to HR and senior leadership without delay.
                    </p>
                  </Line>
                </Thread>
              </div>
            )}

            {/* BRANCH 3: Escalation Approved */}
            {branch === "will_talk" && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud - Formal Tone">
                    <p>
                      Understood. Based on this, we are preparing an official incident report to your Department Head and HR for formal action. Thank you.
                    </p>
                  </Line>
                </Thread>
              </div>
            )}
          </section>

          {}
          {/* SECTION 4: Closing */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Step 4: Wrap Up &amp; Call Conclusion
              </span>
            </div>

            <Thread>
              <Line who="agent" tag="Read aloud">
                Thank you for your time. Have a good day.
              </Line>
              <Line who="manager" tag="Likely reply">
                &ldquo;Okay, thank you.&rdquo;
              </Line>
            </Thread>
            <p className="mt-3 text-xs text-slate-500">
              * Allow the manager to hang up first before logging your call outcome below.
            </p>
          </section>

          {/* SECTION 5: Call Notes & Export */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-red-600">
                <PhoneCall className="h-5 w-5" />
                Call Documentation &amp; Log Notes
              </h2>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Record manager's feedback, promised actions, or specific HR escalation remarks..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none placeholder:text-slate-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={copyNotesToClipboard}
                className="inline-flex items-center gap-2 rounded-xl bg-[#12233B] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 focus:ring-2 focus:ring-slate-900/20 active:scale-95"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Summary Copied!" : "Copy Call Summary to Clipboard"}
              </button>

              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 focus:ring-2 focus:ring-red-600/20"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start New Call Form
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}