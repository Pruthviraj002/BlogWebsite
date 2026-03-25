import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Layout, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { API_BASE_URL } from '../config';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef();
    const headerRef = useRef();
    const gridRef = useRef();
    const cardsRef = useRef([]);

    useGSAP(() => {
        if (categories.length > 0) {
            console.log("Categories loaded, starting animation:", categories.length);
            
            // Force immediate visibility fallback
            gsap.set(cardsRef.current, { opacity: 1, scale: 1, y: 0 });

            const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

            tl.from(headerRef.current, {
                y: 50,
                opacity: 0,
            })
            .from(cardsRef.current, {
                scale: 0.8,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.6");
        }
    }, { scope: containerRef, dependencies: [categories] });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/blog/categories`);
            console.log("Categories API Response:", res.data);
            setCategories(res.data.data || []);
        } catch (error) {
            console.error("Categories Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const getRandomGradient = (i) => {
        const gradients = [
            'from-brand-primary to-indigo-600',
            'from-purple-600 to-brand-secondary',
            'from-cyan-500 to-blue-600',
            'from-rose-500 to-brand-primary',
            'from-emerald-500 to-teal-600',
            'from-amber-500 to-orange-600'
        ];
        return gradients[i % gradients.length];
    };

    return (
        <main ref={containerRef} className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-zinc-950 text-white overflow-hidden">
            <div ref={headerRef} className="text-center mb-20 space-y-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">
                    <Sparkles size={14} className="text-brand-primary" />
                    <span>Explore by Topic</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                    Browse All <br />
                    <span className="gradient-text">Categories</span>
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">
                    Dive deep into the subjects that matter most to you. From technical excellence to creative storytelling.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <Loader2 className="animate-spin text-brand-primary" size={64} strokeWidth={1} />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Architecting Knowledge...</p>
                </div>
            ) : (
                <>
                    {categories.length > 0 ? (
                        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((cat, i) => (
                                <Link 
                                    to={`/blog?category=${cat.name}`} 
                                    key={i}
                                    ref={el => cardsRef.current[i] = el}
                                    className="category-card group bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden transition-all duration-500 hover:border-brand-primary/30"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getRandomGradient(i)} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
                                    
                                    <div className="relative z-10 space-y-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${getRandomGradient(i)} flex items-center justify-center text-white shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                                            <Layout size={28} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black tracking-tight group-hover:text-brand-accent transition-colors">
                                                {cat.name}
                                            </h2>
                                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                                                {cat.count || 0} Stories Published
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-brand-primary font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                            <span>Explore Category</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 glass rounded-[4rem] border border-white/5">
                            <p className="text-zinc-500 font-medium text-lg italic mb-8 text-white">No topics found. Be the first to start a conversation.</p>
                            <Link to="/register" className="btn-modern px-10 py-4 inline-block">Join Sanctuary</Link>
                        </div>
                    )}

                    {/* Guest Guidance Section */}
                    <div className="mt-20 glass p-12 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-left space-y-4">
                            <h3 className="text-3xl font-black tracking-tight">Ready to Share Your <span className="gradient-text">Perspective?</span></h3>
                            <p className="text-zinc-400 font-medium">Lumina collectors and writers enjoy full ownership of their narratives.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-zinc-400 font-bold hover:text-white transition-colors">Login to Create</Link>
                            <Link to="/register" className="btn-modern px-8 py-3">Get Started</Link>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Categories;
