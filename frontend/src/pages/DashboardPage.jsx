// import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
// import { formatDate } from "../utils/date";

// const DashboardPage = () => {
// 	const { user, logout } = useAuthStore();

// 	const handleLogout = () => {
// 		logout();
// 	};
// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, scale: 0.9 }}
// 			animate={{ opacity: 1, scale: 1 }}
// 			exit={{ opacity: 0, scale: 0.9 }}
// 			transition={{ duration: 0.5 }}
// 			className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
// 		>
// 			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
// 				Dashboard
// 			</h2>

// 			<div className='space-y-6'>
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.2 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
// 					<p className='text-gray-300'>Name: {user.name}</p>
// 					<p className='text-gray-300'>Email: {user.email}</p>
// 				</motion.div>
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.4 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
// 					<p className='text-gray-300'>
// 						<span className='font-bold'>Joined: </span>
// 						{new Date(user.createdAt).toLocaleDateString("en-US", {
// 							year: "numeric",
// 							month: "long",
// 							day: "numeric",
// 						})}
// 					</p>
// 					<p className='text-gray-300'>
// 						<span className='font-bold'>Last Login: </span>

// 						{formatDate(user.lastLogin)}
// 					</p>
// 				</motion.div>
// 			</div>

// 			<motion.div
// 				initial={{ opacity: 0, y: 20 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				transition={{ delay: 0.6 }}
// 				className='mt-4'
// 			>
// 				<motion.button
// 					whileHover={{ scale: 1.05 }}
// 					whileTap={{ scale: 0.95 }}
// 					onClick={handleLogout}
// 					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
// 				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
// 				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
// 				>
// 					Logout
// 				</motion.button>
// 			</motion.div>
// 		</motion.div>
// 	);
// };
// export default DashboardPage;


import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  UserCircle2,
  PlusCircle,
  Edit,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import healthmate from "../assets/hearth.jpg"

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  // Load from localStorage when component mounts

  const { familyCreate, error } = useAuthStore();

useEffect(() => {
  const stored = localStorage.getItem("familyMembers");
  if (stored) setFamilyMembers(JSON.parse(stored));
}, []);

useEffect(() => {
  localStorage.setItem("familyMembers", JSON.stringify(familyMembers));
}, [familyMembers]);



  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Save or Edit Member
  const handleSave = (e) => {
    e.preventDefault();
    // await familyCreate(name, relation)
  
    if (!name.trim() || !relation.trim()) return;

    if (editingMember !== null) {
      const updated = [...familyMembers];
      updated[editingMember] = { name, relation };
      setFamilyMembers(updated);
      setEditingMember(null);
    } else {
      setFamilyMembers([...familyMembers, { name, relation }]);
    }

    setName("");
    setRelation("");
    setShowPopup(false);
  };

  // Delete Member
  const handleDelete = (index) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  // Edit Member
  const handleEdit = (index) => {
    const member = familyMembers[index];
    setName(member.name);
    setRelation(member.relation);
    setEditingMember(index);
    setShowPopup(true);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white"
          : "bg-gradient-to-br from-gray-100 via-green-100 to-emerald-50 text-gray-900"
      }`}
    >
      {/* Top Bar */}
      <header
        className={`flex items-center justify-between p-4 shadow-md ${
          darkMode ? "bg-black/40" : "bg-white/60"
        } backdrop-blur-xl sticky top-0 z-30`}
      >
        <div className="flex items-center gap-2">
         <img src={healthmate} alt="HealthMate" className="w-10 h-10 rounded-md" />
          <h1 className="text-lg font-semibold">HealthMate Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
            className="hover:text-green-400 transition"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* Add Family Member */}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:block">Add Family Member</span>
          </button>

          {/* Profile Button (HomePage Style) */}
          <div className="relative">
            <button
              onClick={() => setShowProfile((s) => !s)}
              className="hover:text-green-400 transition"
              title="Profile"
            >
              <UserCircle2 size={28} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 text-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-xs text-emerald-200">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/dashboard"
                    className="flex-1 px-3 py-2 rounded bg-emerald-500 text-black text-center font-semibold"
                    onClick={() => setShowProfile(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-3 py-2 rounded bg-red-500 text-black font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6">Your Family Members 👨‍👩‍👧‍👦</h2>

        {familyMembers.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No family members added yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {familyMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-5 shadow-lg ${
                  darkMode ? "bg-white/10" : "bg-white"
                } backdrop-blur-md border border-white/20`}
              >
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm opacity-80 mb-4">{member.relation}</p>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-400 hover:text-blue-500 transition"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                 <button
  onClick={() =>
    navigate("/reports", { state: { member: member } })
  }
  className="text-green-400 hover:text-green-500 transition"
  title="Open Member"
>
  <FolderOpen size={20} />
</button>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add Family Member Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-8 rounded-2xl w-[90%] sm:w-[400px] bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white shadow-2xl border border-white/10"
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {editingMember !== null
                  ? "Edit Family Member"
                  : "Add Family Member"}
              </h2>

              <form className="space-y-4" onSubmit={handleSave}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Relation"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none"
                />

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-green-500 px-5 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPopup(false);
                      setEditingMember(null);
                      setName("");
                      setRelation("");
                    }}
                    className="bg-gray-500 px-5 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;







