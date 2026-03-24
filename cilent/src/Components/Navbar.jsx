import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Moon,
    Sun,
    LayoutDashboard,
    LogOut,
    Ghost,
    X,
    Menu,
    LogIn,
    UserPlus
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Slice/userSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const { data: user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2.5 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all duration-300">
                            <Ghost className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            Lumina<span className="text-brand-primary">Blog</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        <NavLink to="/" className={({ isActive }) => `text-sm font-bold tracking-wide transition-all hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                            Home
                        </NavLink>
                        <NavLink to="/blog" className={({ isActive }) => `text-sm font-bold tracking-wide transition-all hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                            Feed
                        </NavLink>
                        {user && (
                            <NavLink to="/add-blog" className={({ isActive }) => `text-sm font-bold tracking-wide transition-all hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                                Create
                            </NavLink>
                        )}
                        {user?.isAdmin && (
                            <Link to="/admin" className="flex items-center space-x-2 text-sm font-bold text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-xl">
                                <LayoutDashboard size={18} />
                                <span>Admin</span>
                            </Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-brand-primary"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="text-right hover:text-brand-primary transition-colors">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.isAdmin ? 'Admin' : 'Writer'}</p>
                                    <p className="text-sm font-bold">{user.name}</p>
                                </Link>
                                <button
                                    onClick={() => dispatch(logout())}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="btn-modern px-7 py-2.5">Join Community</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/95 border-b border-white/10 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-300 hover:bg-white/5 rounded-xl">Home</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-300 hover:bg-white/5 rounded-xl">About</Link>
                        <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-300 hover:bg-white/5 rounded-xl">Blog</Link>
                        {user && (
                            <Link to="/add-blog" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-300 hover:bg-white/5 rounded-xl">Create</Link>
                        )}
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-300 hover:bg-white/5 rounded-xl">Contact</Link>
                        <hr className="border-white/10 my-4" />
                        <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-3 py-4 text-base font-medium text-gray-300 hover:bg-white/5 rounded-xl">
                            <LogIn className="w-5 h-5" />
                            <span>Login</span>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center space-x-2 px-3 py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform">
                            <UserPlus className="w-5 h-5" />
                            <span>Get Started</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
