"use client";

import { ReactNode, useState } from "react";
import { Manrope } from "next/font/google";
import {
  FileText,
  Gauge,
  GitBranch,
  Headset,
  Lightbulb,
  PhoneCall,
  RadioTower,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  ThumbsUp,
  UserCheck,
  UserRound,
  Car,
  IdCard,
} from "lucide-react";

const font = Manrope({ subsets: ["latin"] });

type Branch = "no" | "details" | null;

interface ViolationsState {
  mobile: boolean;
  passengerSeatbelt: boolean;
  driverSeatbelt: boolean;
  maxSpeed: boolean;
}

/* Filled value = teal. Missing value = amber [placeholder], so the agent never reads a blank. */
const Token = ({ v, ph }: { v: string; ph: string }) =>
  v.trim() ? (
    <span className="font-bold text-teal-700">{v}</span>
  ) : (
    <span className="rounded bg-amber-100 px-1.5 font-bold text-amber-800">[{ph}]</span>
  );

/* One spoken line. "agent" = read aloud. "manager" = what the manager is expected to say. */
function Line({ who, tag, children }: { who: "agent" | "manager"; tag: string; children: ReactNode }) {
  const agent = who === "agent";
  return (
    <div className="relative pl-12">
      <span
        className={`absolute left-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full text-white ${
          agent ? "bg-teal-600" : "bg-[#12233B]"
        }`}
      >
        {agent ? <Headset className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
      </span>
      <p className="mb-1 flex items-center gap-2 text-sm font-bold">
        {agent ? "You (Control Tower)" : "Manager"}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            agent ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {tag}
        </span>
      </p>
      <div
        className={`rounded-2xl p-4 leading-relaxed ${
          agent
            ? "rounded-tl-sm border border-teal-200 bg-teal-50 text-lg"
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

/* Other things a manager might say, and how to respond. */
function Alternatives({ items }: { items: { says: string; you: string }[] }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold">
        <GitBranch className="h-4 w-4 text-slate-500" /> If the manager says something else
        <span className="text-xs font-medium text-slate-500">(suggested handling)</span>
      </p>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.says} className="grid gap-1 text-sm sm:grid-cols-[200px_1fr] sm:gap-4">
            <span className="font-semibold text-slate-700">&ldquo;{i.says}&rdquo;</span>
            <span className="text-slate-600">{i.you}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Page() {
  const [manager, setManager] = useState("Fahad Alshehri");
  const [driver, setDriver] = useState("Mitthun Sharma");
  const [employeeId, setEmployeeId] = useState("10013897");
  const [licensePlate, setLicensePlate] = useState("2292-HRB");
  const [speed, setSpeed] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState<Branch>(null);
  const [notes, setNotes] = useState("");

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
  };

  const input = (label: string, value: string, set: (v: string) => void, ph: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={ph}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
      />
    </label>
  );

  const getSelectedViolationsText = () => {
    const list: string[] = [];
    if (violations.maxSpeed) list.push("driving over the speed limit");
    if (violations.mobile) list.push("using phone while driving");
    if (violations.driverSeatbelt) list.push("driver seatbelt violation");
    if (violations.passengerSeatbelt) list.push("passenger seatbelt violation");

    if (list.length === 0) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
  };

  const selectedViolationsSummary = getSelectedViolationsText();

  return (
    <main className={`${font.className} min-h-screen bg-[#EDF1F5] text-[#12233B]`}>
      <header className="bg-[#12233B] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500 text-[#12233B]">
              <RadioTower className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold leading-tight">Control Tower call script</h1>
              <p className="text-sm text-slate-300">Driver safety violation · Call to fleet manager</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-sm font-bold">Fill in before you call</h2>
            <div className="space-y-3">
              {input("Manager name", manager, setManager, "Manager's name")}
              {input("Driver name", driver, setDriver, "Driver's name")}
              {input("Employee ID", employeeId, setEmployeeId, "e.g. EMP-9821")}
              {input("License Plate / Vehicle No.", licensePlate, setLicensePlate, "e.g. KAZ-4820")}

              {/* Violations selection */}
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-slate-500">Violations observed</span>
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.mobile}
                      onChange={() => toggleViolation("mobile")}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    />
                    <span>Mobile Use</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.passengerSeatbelt}
                      onChange={() => toggleViolation("passengerSeatbelt")}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    />
                    <span>Passenger Seatbelt</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.driverSeatbelt}
                      onChange={() => toggleViolation("driverSeatbelt")}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    />
                    <span>Driver Seatbelt</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={violations.maxSpeed}
                      onChange={() => toggleViolation("maxSpeed")}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    />
                    <span>Max Speed</span>
                  </label>
                </div>
              </div>

              {input("Speeding detail (optional)", speed, setSpeed, "e.g. 82 km/h in a 60 zone")}
              {input("Phone use detail (optional)", phone, setPhone, "e.g. 2 events in 20 min")}
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-slate-600">
              <span className="font-bold text-teal-700">Teal boxes</span> are yours to read aloud.{" "}
              <span className="font-bold text-slate-700">Grey boxes</span> are what the manager is expected to say.
            </p>
          </div>
        </aside>

        <div className="space-y-5">
          {/* Greeting Section */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <Thread>
              <Line who="agent" tag="Read aloud">
                Hello! Good evening! This is Sakib from the Control Tower. Am I speaking
                with <Token v={manager} ph="Manager's name" />?
              </Line>
              <Line who="manager" tag="Expected reply">
                &ldquo;Yes, speaking! How can I help you?&rdquo;
              </Line>
            </Thread>
            <Alternatives
              items={[
                { says: "Who is this?", you: "Say your name again and that you are calling from the Control Tower." },
                {
                  says: "I'm not the manager.",
                  you: "Ask politely for the manager or a good time to call back. Do not share any driver details.",
                },
                {
                  says: "I'm busy right now.",
                  you: "Apologise for the interruption and offer to keep it short or call back at a time that suits them.",
                },
              ]}
            />
          </section>

          {/* Explanation Section */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <Thread>
              <Line who="agent" tag="Read aloud">
                <div className="space-y-3">
                  <p>
                    I&apos;m calling to let you know about a safety issue with one of your drivers,{" "}
                    <Token v={driver} ph="Driver's name" /> (ID: <Token v={employeeId} ph="Employee ID" />), driving vehicle{" "}
                    <Token v={licensePlate} ph="Vehicle No." />. Our system flagged him with a few violations, like{" "}
                    <Token v={selectedViolationsSummary} ph="violations observed" />.
                  </p>
                  <p>
                    Because safety is so important, we would really appreciate your help in talking to him about this.
                    Also, if you have any questions at all, please feel free to ask me!
                  </p>
                </div>
              </Line>
            </Thread>

            {/* Violation Cards Display */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.maxSpeed
                    ? "bg-red-50 text-red-700 ring-red-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <Gauge className="h-5 w-5" />
                <span className="text-sm font-semibold">Driving over the speed limit</span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.mobile
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-sm font-semibold">Using phone while driving</span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.driverSeatbelt
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">Driver seatbelt violation</span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                  violations.passengerSeatbelt
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-slate-50 text-slate-400 ring-slate-200 opacity-60"
                }`}
              >
                <ShieldAlert className="h-5 w-5" />
                <span className="text-sm font-semibold">Passenger seatbelt violation</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Stay calm and supportive. You are asking for help, not blaming. Pause, then let the manager reply.
            </p>
          </section>

          {/* Manager Response Branching Section */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <p className="mb-3 text-sm font-semibold text-slate-600">Listen, then tap what the manager said.</p>
            <div className="space-y-3">
              {(
                [
                  ["no", ThumbsUp, "No questions, I will talk to him."],
                  ["details", FileText, "Yes, can you share the details?"],
                ] as const
              ).map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setBranch(key)}
                  aria-pressed={branch === key}
                  className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    branch === key
                      ? "bg-[#12233B] text-white ring-2 ring-[#12233B]"
                      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200/70"
                  }`}
                >
                  <UserRound className="h-5 w-5 shrink-0" />
                  <span className="flex-1 font-semibold">&ldquo;{label}&rdquo;</span>
                  <Icon className="h-5 w-5 shrink-0 opacity-70" />
                </button>
              ))}
            </div>

            {branch === "no" && (
              <div className="mt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud">
                    Thank you. Please talk to him about it.
                    <span className="mt-1 block text-sm text-slate-500">
                      Suggested wording.
                    </span>
                  </Line>
                </Thread>
              </div>
            )}

            {branch === "details" && (
              <div className="mt-5">
                <Thread>
                  <Line who="agent" tag="Read aloud">
                    <p>
                      Of course. Our system recorded this for <Token v={driver} ph="Driver's name" /> (ID:{" "}
                      <Token v={employeeId} ph="Employee ID" />) operating vehicle <Token v={licensePlate} ph="Vehicle No." />:
                    </p>
                    <ul className="mt-3 space-y-2 text-base">
                      {violations.maxSpeed && (
                        <li className="flex items-start gap-3">
                          <Gauge className="mt-1 h-5 w-5 shrink-0 text-red-600" />
                          <span>
                            Driving over the speed limit: <Token v={speed} ph="speeding detail" />
                          </span>
                        </li>
                      )}
                      {violations.mobile && (
                        <li className="flex items-start gap-3">
                          <Smartphone className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
                          <span>
                            Using phone while driving: <Token v={phone} ph="phone use detail" />
                          </span>
                        </li>
                      )}
                      {violations.driverSeatbelt && (
                        <li className="flex items-start gap-3">
                          <UserCheck className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
                          <span>Driver seatbelt was unfastened during transit</span>
                        </li>
                      )}
                      {violations.passengerSeatbelt && (
                        <li className="flex items-start gap-3">
                          <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
                          <span>Passenger seatbelt violation detected</span>
                        </li>
                      )}
                    </ul>
                    <p className="mt-3">Do you have any other questions?</p>
                  </Line>
                  <Line who="manager" tag="Likely reply">
                    &ldquo;No, thank you. I will talk to him.&rdquo;
                  </Line>
                </Thread>
                <p className="mt-3 text-sm text-slate-500">
                  Suggested wording, not in the original script. Share only the facts you filled in on the left. If you
                  do not know something, say you will check. Do not guess.
                </p>
              </div>
            )}
          </section>

          {/* Closure Section */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <Thread>
              <Line who="agent" tag="Read aloud">
                Perfect! Thank you so much for your time and help today. You can always call us back on this number if
                you need anything else. Have a great day ahead!
              </Line>
              <Line who="manager" tag="Likely reply">
                &ldquo;Thank you. Goodbye.&rdquo;
              </Line>
            </Thread>
            <p className="mt-4 text-sm text-slate-500">Let the manager end the call first, then log the outcome below.</p>
          </section>

          {/* Call Notes Section */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <PhoneCall className="h-5 w-5 text-teal-600" /> Call notes
              </h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Manager's reply, promised actions, follow-up needed…"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            />
            <button
              onClick={reset}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              <RotateCcw className="h-4 w-4" /> Reset for next call
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}