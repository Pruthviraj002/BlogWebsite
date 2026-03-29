import { useState, useEffect } from 'react';
import { Search, Mail, Instagram, Twitter, Github, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/blog/categories');
                if (res.data.data) {
                    setCategories(res.data.data.slice(0, 8)); // Show top 8
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/blog?search=${search}`);
        }
    };

    return (
        <aside className="space-y-12 h-full">
            {/* Search Widget */}
            <div className="glass p-8 rounded-[2rem] border border-white/5">
                <h3 className="text-xl font-black mb-6 tracking-tight">Search <span className="text-brand-accent">Stories</span></h3>
                <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-accent transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Type to search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-brand-accent/20 transition-all font-medium text-sm"
                    />
                </form>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-brand-primary text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <Mail className="text-brand-accent mb-6" size={32} />
                    <h3 className="text-2xl font-black mb-4 leading-tight">Join our <br/> weekly digest</h3>
                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                        The latest stories, sent directly to your inbox every Sunday.
                    </p>
                    <div className="space-y-3">
                        <input 
                            type="email" 
                            placeholder="Email address"
                            className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 ring-brand-accent/50 text-sm"
                        />
                        <button className="w-full btn-modern py-3 text-xs flex items-center justify-center gap-2">
                            <span>Subscribe</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
                {/* Decorative background shape */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-accent/20 blur-3xl rounded-full"></div>
            </div>

            {/* Categories Widget */}
            <div className="glass p-8 rounded-[2rem] border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black tracking-tight">Explore <span className="text-brand-accent">Topics</span></h3>
                    <Link to="/blog" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-brand-accent transition-colors">View All</Link>
                </div>
                <div className="flex flex-wrap gap-3">
                    {categories.length > 0 ? categories.map((cat) => (
                        <Link 
                            key={cat._id} 
                            to={`/blog?category=${cat.name}`}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-300"
                        >
                            {cat.name}
                        </Link>
                    )) : (
                        ['Design', 'Tech', 'Startup', 'Lifestyle', 'AI', 'Coding'].map(tag => (
                            <span key={tag} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold opacity-50 cursor-default">
                                {tag}
                            </span>
                        ))
                    )}
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
