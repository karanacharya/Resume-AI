import { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";



const SECTIONS = [
    { id: "technical", label: "Technical Questions", icon: "</>" },
    { id: "behavioral", label: "Behavioral Questions", icon: "💬" },
    { id: "roadmap", label: "Road Map", icon: "🗺️" },
];

function severityStyle(severity) {
    if (severity === "high") return "bg-red-900 text-red-300 border border-red-700";
    if (severity === "medium") return "bg-orange-900 text-orange-300 border border-orange-700";
    return "bg-yellow-900 text-yellow-300 border border-yellow-700";
}

function ScoreCircle({ score }) {
    const [displayed, setDisplayed] = useState(0);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayed / 100) * circumference;

    useEffect(() => {
        let count = 0;
        const timer = setInterval(() => {
            count++;
            setDisplayed(count);
            if (count >= score) clearInterval(timer);
        }, 18);
        return () => clearInterval(timer);
    }, [score]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-2">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke="#4ade80" strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.04s linear" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{displayed}</span>
                    <span className="text-xs text-gray-400">%</span>
                </div>
            </div>
            <p className="text-green-400 text-xs text-center font-medium">
                {score >= 80 ? "Strong match for this role" : score >= 60 ? "Good match for this role" : "Moderate match"}
            </p>
        </div>
    );
}

function QuestionCard({ item, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-start justify-between gap-3 text-left"
            >
                <p className="text-sm font-medium text-white leading-relaxed">{item.question}</p>
                <span className="text-gray-500 text-lg flex-shrink-0 mt-0.5">{open ? "▾" : "▸"}</span>
            </button>
            {open && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-yellow-400 uppercase tracking-widest mb-1">Intent</p>
                    <p className="text-xs text-gray-400 mb-3">{item.intention}</p>
                    <p className="text-xs text-green-400 uppercase tracking-widest mb-1">Sample Answer</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
            )}
        </div>
    );
}

function TechnicalSection({ questions }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Technical Questions</h2>
            <p className="text-gray-500 text-sm mb-6">Questions likely to come up based on your profile</p>
            <div className="flex flex-col gap-4">
                {questions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
            </div>
        </div>
    );
}

function BehavioralSection({ questions }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Behavioral Questions</h2>
            <p className="text-gray-500 text-sm mb-6">Soft-skill and situational questions</p>
            <div className="flex flex-col gap-4">
                {questions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
            </div>
        </div>
    );
}

function RoadmapSection({ plan }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold">Preparation Road Map</h2>
                <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full border border-gray-700">
                    {plan.length}-day plan
                </span>
            </div>
            <div className="flex flex-col">
                {plan.map((item, i) => (
                    <div key={i} className="flex gap-5">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-red-500 flex items-center justify-center flex-shrink-0 z-10">
                                <span className="text-xs font-bold text-red-400">{item.day}</span>
                            </div>
                            {i < plan.length - 1 && <div className="w-0.5 bg-gray-800 flex-1 my-1" style={{ minHeight: "32px" }} />}
                        </div>
                        {/* Content */}
                        <div className="pb-8 flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs bg-red-900 text-red-300 border border-red-700 px-2 py-0.5 rounded-full font-medium">
                                    Day {item.day}
                                </span>
                                <h3 className="text-base font-semibold text-white">{item.focus}</h3>
                            </div>
                            <ul className="flex flex-col gap-1.5">
                                {item.tasks.map((t, j) => (
                                    <li key={j} className="text-sm text-gray-400 flex gap-2">
                                        <span className="text-gray-600 mt-0.5 flex-shrink-0">•</span>
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function InterviewReport() {
    const { report, fetchReport, buttonloading, fetchUserReports, loading, setLoading, generateResumePdf } = useInterview();
    const data = report;
    const [activeSection, setActiveSection] = useState("technical");
    const { interviewId } = useParams();


    function handleOnclickResumeGenerator() {

        generateResumePdf({ interviewReportId: interviewId })
    }

    useEffect(() => {
        if (interviewId) {
            fetchReport(interviewId);
        }
    }, [interviewId])


    if (loading || !report) {
        return (
            <div className="bg-gray-950 text-white min-h-screen flex flex-col items-center justify-center px-4 py-2">
                <h1 className="text-4xl font-bold text-white">Loading Your Interview Report...</h1>
                <p className="text-gray-400 mt-2 text-sm">Please wait while we fetch your personalized interview insights! 🚀</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">

            {/* Left Sidebar */}
            <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-5 flex-shrink-0">
                <div className="h-auto w-auto">
                    <h1 className="text-xl font-bold mb-8">
                        Interv<span className="text-yellow-400">AI</span>
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Sections</p>
                    <nav className="flex flex-col gap-1">
                        {SECTIONS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition
                ${activeSection === s.id
                                        ? "bg-gray-800 text-white border-l-2 border-yellow-400 pl-2.5"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                            >
                                <span className="text-gray-400">{s.icon}</span>
                                {s.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto group relative inline-block w-auto">

                    {/* Tooltip */}
                    <p className="absolute bottom-full left-2/3 -translate-x-1/2 mb-1
                  w-64 bg-gray-900 text-white text-sm font-semibold 
                  rounded-lg shadow-lg p-3 
                  opacity-0 group-hover:opacity-100 transition duration-200">

                        This will generate a resume tailored to the job description using AI.


                    </p>

                    <button
                        onClick={handleOnclickResumeGenerator}
                        disabled={buttonloading}
                        className={`mt-2 block p-2 rounded-xl h-15 font-medium transition 
                                ${buttonloading
                                ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
                                : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"}`}
                    >
                        {buttonloading ? (
                            <>
                                {/* Spinner */}
                                <svg
                                    className="h-5 w-5 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>

                                Downloading...
                            </>
                        ) : (
                            <>
                                {/* Icon */}
                                <svg
                                    className="h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956Z" />
                                </svg>

                                Download Resume
                            </>
                        )}
                    </button>

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {activeSection === "technical" && <TechnicalSection questions={data.technicalQuestion} />}
                {activeSection === "behavioral" && <BehavioralSection questions={data.behavioralQuestion} />}
                {activeSection === "roadmap" && <RoadmapSection plan={data.preparationPlan} />}
            </main>

            {/* Right Panel */}
            <aside className="w-56 bg-gray-900 border-l border-gray-800 flex flex-col p-5 flex-shrink-0">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Match Score</p>
                <ScoreCircle score={data.matchScore} />

                <hr className="border-gray-800 my-5" />

                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Skill Gaps</p>
                <div className="flex flex-col gap-2">
                    {data.skillGaps.map((g, i) => (
                        <div key={i} className={`text-xs px-3 py-2 rounded-lg font-medium ${severityStyle(g.severity)}`}>
                            {g.skill}
                        </div>
                    ))}
                </div>
            </aside>

        </div>
    );
}