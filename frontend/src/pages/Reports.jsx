// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sun,
  Moon,
  Plus,
  X,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAuthStore } from "../store/authStore";
import healthmate from "../assets/hearth.jpg"; // adjust path if needed

// --------- IMPORTANT -------------
// For production: DO NOT call Gemini directly from client with your API key.
// Instead create a backend endpoint that holds the key and forwards requests.
// Below example uses a client-side fetch purely for demonstration.
// ---------------------------------

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore(); // get logged-in user
  // member can be passed via route state: navigate("/reports", { state: { member } })
  const memberFromState = location.state?.member;
  const memberName = (memberFromState && memberFromState.name) || user?.name || "You";

  const [darkMode, setDarkMode] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // form fields
  const [title, setTitle] = useState("");
  const [test, setTest] = useState("");
  const [lab, setLab] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [flag, setFlag] = useState("Normal");
  const [notes, setNotes] = useState("");

  // sample vitals data for chart (dummy)
  const [chartData, setChartData] = useState([
    { date: "Oct 01", Systolic: 130, Diastolic: 85, Sugar: 95 },
    { date: "Oct 05", Systolic: 128, Diastolic: 82, Sugar: 92 },
    { date: "Oct 09", Systolic: 132, Diastolic: 83, Sugar: 97 },
    { date: "Oct 12", Systolic: 129, Diastolic: 80, Sugar: 94 },
    { date: "Oct 15", Systolic: 131, Diastolic: 81, Sugar: 96 },
  ]);

  // apply dark mode class to html
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // -------------------------------
  // Gemini helper - fetch AI analysis
  // -------------------------------
  // NOTE: Replace with your backend endpoint in production.
  // If you really want to call Gemini from client (not recommended),
  // set REACT_APP_GEMINI_API_KEY in your .env (but again - insecure).
  async function getGeminiHealthAnalysis(reportData) {
    try {
      // Option A: If you have a backend proxy, call it:
      // return await fetch('/api/ai/analyze', { method: 'POST', body: JSON.stringify(reportData) ... })

      // Option B: Direct client call for quick demo (UNSAFE for production)
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
      if (!apiKey) {
        return "AI analysis disabled (no API key).";
      }

      // Example request body suitable for the Google Generative Language REST API.
      // Adjust the endpoint/model name as per your access (gemini-pro, gemini-1.5, etc.)
      const prompt = `You are a friendly medical assistant. Analyze the following medical report details and return a clear, concise explanation in plain English (2-6 bullet points) and one short note in Roman Urdu. Report details:\n\n${JSON.stringify(
        reportData,
        null,
        2
      )}\n\nHighlight abnormal values and give 3 suggested questions to ask the doctor.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-pro:generateText?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // This JSON shape may vary depending on the exact Gemini endpoint version you have access to.
            // Adjust according to the official docs / your backend proxy.
            prompt: prompt,
            maxOutputTokens: 600,
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        console.error("Gemini response error:", res.status, txt);
        return "AI analysis failed (remote error).";
      }

      const data = await res.json();
      // Picking reply from plausible fields — adapt to actual response structure
      // Many Gemini endpoints return something like data.candidates[0].output[0].content or so.
      // For safety, try multiple common keys:
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.output?.[0]?.content ||
        data?.output?.[0]?.content ||
        data?.response ||
        JSON.stringify(data).slice(0, 1000);

      return typeof text === "string" ? text : JSON.stringify(text);
    } catch (err) {
      console.error("getGeminiHealthAnalysis error:", err);
      return "AI analysis failed (exception).";
    }
  }

  // -------------------------------
  // Add new report (to state + localStorage + AI)
  // -------------------------------
  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!title || !test || !lab || !date) return;

    const newReport = {
      id: Date.now().toString(),
      title,
      test,
      lab,
      doctor,
      date,
      price,
      flag,
      notes,
      aiAnalysis: "Analyzing...", // placeholder while we call AI
    };

    // add immediately (so user sees it)
    setReports((prev) => {
      const next = [newReport, ...prev];
      return next;
    });

    // update chart with a sample point
    const samplePoint = {
      date: date || `Entry ${prevLength() + 1}`,
      Systolic: averageOrRandom(chartData.map((d) => d.Systolic)),
      Diastolic: averageOrRandom(chartData.map((d) => d.Diastolic)),
      Sugar: averageOrRandom(chartData.map((d) => d.Sugar)),
    };
    setChartData((c) => [...c.slice(0, 10), samplePoint]);

    // reset form in UI
    setTitle("");
    setTest("");
    setLab("");
    setDoctor("");
    setDate("");
    setPrice("");
    setFlag("Normal");
    setNotes("");
    setShowAddModal(false);

    // call Gemini (or backend) to get analysis and update the report object
    (async () => {
      try {
        const aiReply = await getGeminiHealthAnalysis({
          title: newReport.title,
          test: newReport.test,
          lab: newReport.lab,
          doctor: newReport.doctor,
          date: newReport.date,
          price: newReport.price,
          flag: newReport.flag,
          notes: newReport.notes,
          memberName,
        });

        // update the report in state
        setReports((prev) =>
          prev.map((r) => (r.id === newReport.id ? { ...r, aiAnalysis: aiReply } : r))
        );
      } catch (err) {
        console.error("AI update failed:", err);
        setReports((prev) =>
          prev.map((r) =>
            r.id === newReport.id ? { ...r, aiAnalysis: "AI analysis failed." } : r
          )
        );
      }
    })();
  };

  function prevLength() {
    return reports.length;
  }
  function averageOrRandom(arr = []) {
    if (!arr.length) return Math.round(90 + Math.random() * 40);
    const avg = Math.round(arr.reduce((s, v) => s + Number(v || 0), 0) / arr.length);
    // small random variance
    return Math.max(30, avg + Math.round((Math.random() - 0.5) * 6));
  }

  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDeleteReport = (id) => {
    setReports((r) => r.filter((rep) => rep.id !== id));
    if (selectedReport?.id === id) {
      setSelectedReport(null);
      setShowReportModal(false);
    }
  };

  const handleEditReport = (id) => {
    const rep = reports.find((r) => r.id === id);
    if (!rep) return;
    // populate form and open add modal in edit mode (reuse fields)
    setTitle(rep.title);
    setTest(rep.test);
    setLab(rep.lab);
    setDoctor(rep.doctor);
    setDate(rep.date);
    setPrice(rep.price);
    setFlag(rep.flag);
    setNotes(rep.notes || "");
    setShowReportModal(false);
    setShowAddModal(true);
    // delete old entry and on save it will be re-added as new; or you can implement update logic
    // We'll remove it so Save will re-add (simple approach)
    setReports((r) => r.filter((x) => x.id !== id));
  };

  // Load from localStorage when component mounts (per member)
  useEffect(() => {
    if (memberName) {
      try {
        const stored = localStorage.getItem(`reports_${memberName}`);
        if (stored) setReports(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored reports:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberName]);

  // Save whenever reports update (per member)
  useEffect(() => {
    if (memberName) {
      try {
        localStorage.setItem(`reports_${memberName}`, JSON.stringify(reports));
      } catch (err) {
        console.error("Failed to save reports to localStorage:", err);
      }
    }
  }, [reports, memberName]);

  return (
    <div className={`min-h-screen w-full text-white relative`}>
      {/* background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 -z-10" />

      {/* Top bar */}
      <header className="w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={healthmate} alt="HealthMate" className="w-10 h-10 rounded-md" />
            <div>
              <div className="text-lg font-bold">HealthMate</div>
              <div className="text-xs text-emerald-200">Sehat ka Smart Dost</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              onClick={() => setDarkMode((s) => !s)}
              className="p-2 rounded-md hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* member name + Add New Report */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-emerald-200">You</div>
            <h2 className="text-2xl md:text-3xl font-bold">{memberName}</h2>
          </div>

          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition flex items-center gap-2"
            >
              <Plus /> Add new report
            </button>
          </div>
        </div>

        {/* Vitals trend chart */}
        <section className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Vitals trend</h3>
            <div className="text-sm text-emerald-200">Recent entries</div>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  wrapperStyle={{
                    background: darkMode ? "#0f1720" : "#fff",
                    border: "none",
                    color: darkMode ? "#fff" : "#000",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Systolic" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Diastolic" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Sugar" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Table header */}
        <section className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search by title, test, lab..."
                className="px-3 py-2 rounded-md bg-white/3 border border-white/10 focus:outline-none w-full md:w-80"
                onChange={() => {}}
              />
              <input type="date" className="px-3 py-2 rounded-md bg-white/3 border border-white/10" />
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-md border border-white/10 text-sm">Filter</button>
            </div>
          </div>

          {/* Reports table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-emerald-200">
                  <th className="px-3 py-3">Title</th>
                  <th className="px-3 py-3">Test</th>
                  <th className="px-3 py-3">Lab/Hospital</th>
                  <th className="px-3 py-3">Doctor</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Flag</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-gray-300">
                      No reports yet. Click <strong>Add new report</strong> to create one.
                    </td>
                  </tr>
                )}

                {reports.map((r) => (
                  <tr key={r.id} className="border-t border-white/6">
                    <td className="px-3 py-3 text-sm">{r.title}</td>
                    <td className="px-3 py-3 text-sm">{r.test}</td>
                    <td className="px-3 py-3 text-sm">{r.lab}</td>
                    <td className="px-3 py-3 text-sm">{r.doctor}</td>
                    <td className="px-3 py-3 text-sm">{r.date}</td>
                    <td className="px-3 py-3 text-sm">{r.price}</td>
                    <td className="px-3 py-3 text-sm">{r.flag}</td>
                    <td className="px-3 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenReport(r)}
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Open
                        </button>
                        <button
                          onClick={() => handleEditReport(r.id)}
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(r.id)}
                          className="px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 transition text-black"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Add New Report Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[95%] sm:w-[600px] p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 shadow-2xl border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">Add New Report</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded hover:bg-white/5">
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddReport} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title (e.g., CBC Report)"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                  required
                />
                <input
                  value={test}
                  onChange={(e) => setTest(e.target.value)}
                  placeholder="Test (e.g., CBC)"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                  required
                />
                <input
                  value={lab}
                  onChange={(e) => setLab(e.target.value)}
                  placeholder="Lab / Hospital"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                  required
                />
                <input
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="Doctor"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                />
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                  required
                />
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price (e.g., Rs 3500)"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                />
                <select value={flag} onChange={(e) => setFlag(e.target.value)} className="p-3 rounded-md bg-white/5 border border-white/10">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes / Summary"
                  className="p-3 rounded-md bg-white/5 border border-white/10 md:col-span-2"
                />

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-emerald-500 text-black font-semibold hover:bg-emerald-600">
                    Save report
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Details Modal */}
      <AnimatePresence>
        {showReportModal && selectedReport && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-[95%] sm:w-[600px] p-6 rounded-2xl bg-white/5 text-white"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">Report Details</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowReportModal(false)} className="p-2 rounded hover:bg-white/5">
                    <X />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {selectedReport.title}</p>
                <p><strong>Test:</strong> {selectedReport.test}</p>
                <p><strong>Lab/Hospital:</strong> {selectedReport.lab}</p>
                <p><strong>Doctor:</strong> {selectedReport.doctor}</p>
                <p><strong>Date:</strong> {selectedReport.date}</p>
                <p><strong>Price:</strong> {selectedReport.price}</p>
                <p><strong>Flag:</strong> {selectedReport.flag}</p>
                <p><strong>Notes:</strong> {selectedReport.notes}</p>

                {/* Gemini AI Analysis */}
                <div className="mt-4 p-3 rounded-md bg-emerald-900/30 border border-emerald-600/50">
                  <h4 className="font-semibold text-emerald-300 mb-1">Gemini AI Analysis</h4>
                  <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                    {selectedReport.aiAnalysis || "No AI analysis available."}
                  </pre>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    // open edit (populate add modal)
                    setShowReportModal(false);
                    handleEditReport(selectedReport.id);
                  }}
                  className="px-3 py-2 rounded-md bg-white/5"
                >
                  <Edit size={14} /> Edit
                </button>

                <button
                  onClick={() => {
                    handleDeleteReport(selectedReport.id);
                    setShowReportModal(false);
                  }}
                  className="px-3 py-2 rounded-md bg-red-600 text-black"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
