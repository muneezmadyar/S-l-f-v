import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { formatDate } from "../utils/date";
import { UserCircle2, Menu, X,Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import healthmate from "../assets/hearth.jpg"

// const HomePage = () => {
// 	const { isAuthenticated, user, logout } = useAuthStore();
// 	const [showProfile, setShowProfile] = useState(false);
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// 	const navigate = useNavigate();

// 	const handleLogout = () => {
// 		logout();
// 		setShowProfile(false);
// 		navigate("/login");
// 	};


// 	return (

// 		<div className='min-h-screen w-full bg-gray-900 text-white relative'>
// 			{/* Navbar */}
// 			<nav className='flex justify-between items-center px-6 py-4 bg-black bg-opacity-70 shadow-md sticky top-0 z-50'>
// 				<h1 className='text-2xl font-bold text-green-400'>My Website</h1>

// 				{/* Center Links */}
// 				<div className='hidden md:flex gap-6 text-white text-lg'>
// 					<Link to='/' className='hover:text-green-400'>Home</Link>
// 					<Link to='/about' className='hover:text-green-400'>About</Link>
// 					<Link to='/services' className='hover:text-green-400'>Services</Link>
// 					<Link to='/contact' className='hover:text-green-400'>Contact</Link>
// 				</div>

// 				{/* Right Section */}
// 				<div className='flex items-center gap-4'>
// 					{!isAuthenticated ? (
// 						<>
// 							<Link
// 								to='/login'
// 								className='px-4 py-1 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition duration-300'
// 							>
// 								Login
// 							</Link>
// 							<Link
// 								to='/signup'
// 								className='px-4 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition duration-300'
// 							>
// 								Signup
// 							</Link>
// 						</>
// 					) : (
// 						<button
// 							onClick={() => setShowProfile(!showProfile)}
// 							className='text-white hover:text-green-400'
// 							title='Profile'
// 						>
// 							<UserCircle2 size={28} />
// 						</button>
// 					)}

// 					{/* Sidebar Toggle (Mobile) */}
// 					<button
// 						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// 						className='md:hidden text-white hover:text-green-400'
// 						title='Menu'
// 					>
// 						{isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
// 					</button>
// 				</div>
// 			</nav>

// 			{/* Sidebar */}
// 			<div
// 				className={`fixed top-0 right-0 h-full w-64 bg-black bg-opacity-90 z-50 transform ${
// 					isSidebarOpen ? "translate-x-0" : "translate-x-full"
// 				} transition-transform duration-300 md:hidden p-6`}
// 			>
// 				<div className='flex justify-between items-center mb-6'>
// 					<h2 className='text-green-400 text-xl font-bold'>Menu</h2>
// 					<button onClick={() => setIsSidebarOpen(false)} className='text-white'>
// 						<X size={28} />
// 					</button>
// 				</div>
// 				<nav className='flex flex-col gap-4 text-white text-lg'>
// 					<Link to='/' onClick={() => setIsSidebarOpen(false)} className='hover:text-green-400'>Home</Link>
// 					<Link to='/about' onClick={() => setIsSidebarOpen(false)} className='hover:text-green-400'>About</Link>
// 					<Link to='/services' onClick={() => setIsSidebarOpen(false)} className='hover:text-green-400'>Services</Link>
// 					<Link to='/contact' onClick={() => setIsSidebarOpen(false)} className='hover:text-green-400'>Contact</Link>

					
// 				</nav>
// 			</div>

// 			{/* Main Section */}
// 			<div className='text-center mt-20 px-4'>
// 				<h2 className='text-4xl font-bold'>Welcome to the Home Page</h2>
// 				<p className='mt-4 text-lg'>
// 					{isAuthenticated
// 						? `Hello, ${user.name}!`
// 						: "This is a public landing page for all users."}
// 				</p>
// 			</div>

// 			{/* Profile Modal */}
// 			{showProfile && (
// 				<div className='fixed top-20 right-6 bg-gray-900 text-white p-6 rounded-xl shadow-lg z-50 border border-gray-700 w-80'>
// 					<div className='flex justify-between items-center mb-4'>
// 						<h2 className='text-2xl font-bold text-green-400'>My Profile</h2>
// 						<button onClick={() => setShowProfile(false)} className='hover:text-red-400'>
// 							<X size={20} />
// 						</button>
// 					</div>
// 					<p><strong>Name:</strong> {user.name}</p>
// 					<p><strong>Email:</strong> {user.email}</p>
// 					<p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
// 					<p><strong>Last Login:</strong> {formatDate(user.lastLogin)}</p>
// 					<button
// 						onClick={handleLogout}
// 						className='mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded'
// 					>
// 						Logout
// 					</button>
// 				</div>
// 			)}
// 		</div>
// 	);
     
// };

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // redirect logged-in users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full text-white relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 -z-10" />

      {/* Navbar */}
      <header className="w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={healthmate} alt="HealthMate" className="w-10 h-10 rounded-md" />
            <div>
              <div className="text-lg font-bold">HealthMate</div>
              <div className="text-xs text-emerald-200">Sehat ka Smart Dost</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode((s) => !s)}
              className="p-2 rounded-md hover:bg-white/10 transition"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition"
                >
                  Create account
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfile((s) => !s)}
                  className="p-1 rounded-full hover:bg-white/10 transition"
                  title="Profile"
                >
                  <UserCircle2 size={26} />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 text-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-xs text-emerald-200">{user?.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/dashboard"
                        className="flex-1 px-3 py-2 rounded bg-emerald-500 text-black text-center"
                        onClick={() => setShowProfile(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex-1 px-3 py-2 rounded bg-red-500 text-black"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-12 items-center gap-8"
        >
          {/* Left: text */}
          <div className="md:col-span-7 text-center md:text-left">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-sm font-medium">
              AI-powered Health Companion
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Manage your <span className="text-emerald-300">health, reports</span> &amp;{" "}
              <span className="text-emerald-200">vitals</span> — beautifully
            </h1>

            <p className="mt-6 text-lg text-emerald-100 max-w-2xl">
              Upload your medical reports & prescriptions, get AI-powered explanations in simple
              language, and track vitals all in one secure place. Create an account to get started.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-emerald-400 to-green-500 text-black font-semibold shadow-lg"
              >
                Start free
              </Link>

              <a
                href="#demo"
                className="inline-block px-6 py-3 rounded-md border border-white/20 text-white text-center hover:bg-white/5 transition self-start"
              >
                View live demo
              </a>
            </div>

            <div className="mt-4 text-xs text-emerald-200">“HealthMate — Sehat ka smart dost.”</div>
          </div>

          {/* Right: mock preview card */}
          <div className="md:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-emerald-200 font-semibold">Recent Activity</div>
                  <div className="text-xs text-emerald-300">Demo</div>
                </div>
                <div className="text-sm text-emerald-100">Profile</div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/3 p-3 rounded-md">
                  <div className="font-medium">BP Reading — 10 Oct</div>
                  <div className="text-xs text-emerald-200">130 / 80 — Manual entry</div>
                </div>

                <div className="bg-white/3 p-3 rounded-md">
                  <div className="font-medium">CBC Report — 02 Oct</div>
                  <div className="text-xs text-emerald-200">AI summary: Hb low, WBC normal</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Sections: About / Features / Contact */}
        <div className="mt-20 space-y-20">
          {/* About */}
          <motion.section
            id="about"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/3 rounded-xl p-8"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-3">Why you’ll love HealthMate</h3>
              <p className="text-emerald-100 max-w-2xl mx-auto">
                A secure personal vault for reports, AI explanations in simple language (English +
                Roman Urdu), and an easy timeline of vitals — all built to make healthcare simpler.
              </p>
            </div>
          </motion.section>

          {/* Features */}
          <motion.section
            id="features"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Upload Reports",
                desc: "PDFs, images & scans — Gemini reads them directly, no manual OCR.",
              },
              {
                title: "Bilingual Summaries",
                desc: "English + Roman Urdu summaries that are easy to share with family.",
              },
              {
                title: "Track Vitals",
                desc: "Add manual BP, sugar, weight — view everything in a timeline.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition"
              >
                <div className="text-emerald-200 font-semibold mb-2">{f.title}</div>
                <div className="text-emerald-100 text-sm">{f.desc}</div>
              </div>
            ))}
          </motion.section>

          {/* Contact */}
          <motion.section
            id="contact"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/3 rounded-xl p-8"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-center">Get started or ask a question</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // handle contact submit
                  alert("Thanks — we'll get back to you!");
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Your name"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="p-3 rounded-md bg-white/5 border border-white/10"
                  required
                />
                <textarea
                  placeholder="Message"
                  className="md:col-span-2 p-3 rounded-md bg-white/5 border border-white/10"
                  rows={4}
                  required
                />
                <div className="md:col-span-2 text-right">
                  <button className="px-5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-emerald-200">
        <div className="border-t border-white/10 pt-6 text-center">
          © {new Date().getFullYear()} HealthMate — Sehat ka Smart Dost
        </div>
      </footer>
    </div>
  );
};


export default HomePage;
