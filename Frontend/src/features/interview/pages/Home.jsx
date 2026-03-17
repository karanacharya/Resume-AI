import React, { useRef, useState } from 'react'
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router';




const Home = () => {
    const navigate = useNavigate();
    const resumeRef = useRef();
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [fileName, setFileName] = useState("");

    const { generateReport, loading, reports } = useInterview();


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const resumeFile = resumeRef.current.files[0];
        if (!jobDescription || !selfDescription) {
            alert("Please fill all the fields")
            return;
        }
        try {
            const response = await generateReport({ jobDescription, selfDescription, resumeFile: resumeFile })
            navigate(`/interview-report/${response.interviewReport._id}`)
        } catch (error) {
            console.error("Error generating report:", error);
        }
    }

    if (loading) {
        return (
            <div className="bg-gray-950 text-white min-h-screen flex flex-col items-center justify-center px-4 py-2">
                <h1 className="text-4xl font-bold text-white">Generating Your Interview Report...</h1>
                <p className="text-gray-400 mt-2 text-sm">This may take a moment. Get ready to ace your interview! 🚀</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-950 border border-x-blue-500 border-y-green-500 rounded-xl text-white min-h-screen flex items-center justify-center px-4 py-2">

            <div className="flex w-full max-w-9xl gap-10">

                {/* Recent Reports Section */}
                <div className="w-auto mt-3 bg-gray-900 p-2 text-white rounded-xl scrollbar h-full items-center overflow-hidden min-h-screen flex flex-col">
                    <h2 className="text-2xl font-semibold mb-6 ">
                        Recent Reports By You
                    </h2>

                    <div className="border-2 border-gray-600 rounded-3xl p-4 flex flex-col gap-4">

                        {reports && reports.length > 0 ? (
                            reports.slice(0, 3).map((report) => (
                                <div
                                    key={report._id}
                                    onClick={() => navigate(`/interview-report/${report._id}`)}
                                    className="bg-gray-800 hover:bg-gray-700 cursor-pointer transition rounded-2xl p-4 h-24 flex flex-col justify-center"
                                >
                                    <p className="text-sm font-medium text-white truncate">
                                        {report.title}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Score: {report.matchScore ?? "N/A"}%
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No reports yet
                            </p>
                        )}

                    </div>
                </div>

                {/* Main Section */}
                <div className="flex-1 flex flex-col items-center">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-white">
                            Interv<span className="text-yellow-400">AI</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Upload your details and let AI prep you for the interview
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-xl shadow-xl flex flex-col gap-6">

                        {/* Resume Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Resume <span className="text-yellow-400">*</span>
                            </label>

                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-yellow-400 hover:bg-gray-800 transition">
                                <span className="text-2xl mb-1">📄</span>
                                <span className="text-sm text-gray-400">
                                    Click to upload your resume
                                </span>
                                <span className="text-xs text-gray-600 mt-1">
                                    PDF only
                                </span>

                                <input
                                    ref={resumeRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>

                            {fileName && (
                                <p className="text-xs text-yellow-400 mt-2">
                                    Uploaded: {fileName}
                                </p>
                            )}
                        </div>

                        {/* Job Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Job Description <span className="text-yellow-400">*</span>
                            </label>

                            <textarea
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows="4"
                                placeholder="Paste the job description here..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none transition"
                            ></textarea>
                        </div>

                        {/* Self Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                About Yourself <span className="text-yellow-400">*</span>
                            </label>

                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                rows="4"
                                placeholder="Tell us a bit about yourself — your experience, skills, goals..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none transition"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleOnSubmit}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-semibold rounded-xl py-3 text-sm transition"
                        >
                            Start My Interview Prep →
                        </button>

                    </div>

                    <p className="text-gray-600 text-xs mt-6">
                        Your data is only used to personalize your interview practice.
                    </p>

                </div>

            </div>

        </div>
    )
}

export default Home
