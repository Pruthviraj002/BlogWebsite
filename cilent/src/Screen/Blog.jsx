import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BlogCard from '../Components/BlogCard';
import Pagination from '../Components/Pagination';
import { Search, Filter, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const containerRef = useRef();
    const headerRef = useRef();
    const filterRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

        tl.from(headerRef.current, {
            y: 40,
            opacity: 0,
        })
            .from(filterRef.current, {
                y: 20,
                opacity: 0,
            }, "-=0.8");
    }, { scope: containerRef });

    const handleHover = (e, isEnter) => {
        gsap.to(e.currentTarget, {
            scale: isEnter ? 1.05 : 1,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blog/categories');
            setCategories(['All', ...res.data.data.map(cat => cat.name)]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/blog?search=${search}&category=${category}&page=${page}&limit=6`);
            setBlogs(res.data.data || []);
            setPagination(res.data.pagination || { totalPages: 1 });

            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setPage(1); // Reset to first page on search or category change
    }, [search, category]);

    useEffect(() => {
        const delaySearch = setTimeout(fetchBlogs, 300);
        return () => clearTimeout(delaySearch);
    }, [search, category, page]);

    return (
        <main ref={containerRef} className="pt-32 min-h-screen px-4 max-w-7xl mx-auto pb-20 overflow-hidden">
            {/* Header section */}
            <div ref={headerRef} className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                    Our <span className="gradient-text">Journal</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Discover stories, thinking, and expertise from writers on any topic.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div ref={filterRef} className="flex flex-col md:flex-row gap-6 mb-12">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full glass pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
                    <Filter className="text-gray-500 mr-2 shrink-0" size={20} />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            onMouseEnter={(e) => handleHover(e, true)}
                            onMouseLeave={(e) => handleHover(e, false)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all shrink-0 ${category === cat
                                ? 'bg-brand-primary text-white shadow-lg shadow-indigo-500/20'
                                : 'glass text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="animate-spin text-brand-primary" size={48} />
                    <p className="text-gray-500 font-medium">Loading stories...</p>
                </div>
            ) : blogs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={pagination?.totalPages || 1}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </>
            ) : (
                <div className="text-center py-20 glass rounded-3xl">
                    <p className="text-gray-400 text-lg">No stories found. Try a different search.</p>
                </div>
            )}
        </main>
    );
};

export default Blog;
