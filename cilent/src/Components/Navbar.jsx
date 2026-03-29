import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    BookOpen, // Changed from Ghost to BookOpen
    X,
    Menu,
    LogIn,
    UserPlus,
    UserCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleEditModal } from '../Slice/userSlice';
import { getSafeImageUrl } from '../config';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            Code<span className="text-brand-primary">Stories</span>
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
                        <NavLink to="/categories" className={({ isActive }) => `text-sm font-bold tracking-wide transition-all hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                            Topics
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => `text-sm font-bold tracking-wide transition-all hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                            About
                        </NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `text-sm font-bold tracking-wide transition-all hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}>
                            Contact
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
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => dispatch(toggleEditModal(true))}
                                    className="flex items-center space-x-3 hover:text-brand-primary transition-colors group text-right"
                                >
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{user.isAdmin ? 'Admin' : 'Writer'}</p>
                                        <p className="text-sm font-black tracking-tight">{user.name}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-brand-primary/30 transition-all shadow-lg">
                                        {user?.profilePic ? (
                                            <img 
                                                src={getSafeImageUrl(user.profilePic)} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <UserCircle className="text-gray-400 group-hover:text-brand-primary transition-colors" size={24} />
                                        )}
                                    </div>
                                </button>

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
