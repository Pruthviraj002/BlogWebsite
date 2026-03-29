import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutDashboard, Users, FileText, Settings as SettingsIcon, LogOut, Package } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Narratives from './pages/Narratives';
import Members from './pages/Members';
import Settings from './pages/Settings';
import Login from './pages/Login';

const SidebarItem = ({ name, icon, path }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link 
            to={path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            <span>{name}</span>
        </Link>
    );
};


const App = () => {
    const [token, setToken] = useState(localStorage.getItem('auth-token'));

    const handleLogout = () => {
        if (window.confirm("You are about to exit the secure session. Proceed?")) {
            localStorage.removeItem('auth-token');
            setToken(null);
        }
    };

    if (!token) return <Login setToken={setToken} />;

    return (
        <Router>
            <div className="flex bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-brand-primary/30 antialiased">
                <div className="w-64 h-screen bg-zinc-900 border-r border-white/5 flex flex-col p-6 sticky top-0">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <Package className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-black">Admin <span className="text-brand-primary">Hub</span></h1>
                    </div>
                    
                    <nav className="flex-1 space-y-2">
                        <SidebarItem name="Dashboard" icon={<LayoutDashboard size={20}/>} path="/" />
                        <SidebarItem name="Narratives" icon={<FileText size={20}/>} path="/blogs" />
                        <SidebarItem name="Members" icon={<Users size={20}/>} path="/users" />
                        <SidebarItem name="Settings" icon={<SettingsIcon size={20}/>} path="/settings" />
                    </nav>

                    <div className="pt-6 border-t border-white/5">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold group border border-transparent hover:border-red-400/20"
                        >
                            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
                <main className="flex-1 p-10 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/blogs" element={<Narratives />} />
                        <Route path="/users" element={<Members />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
            <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </Router>
    );
};

export default App;
