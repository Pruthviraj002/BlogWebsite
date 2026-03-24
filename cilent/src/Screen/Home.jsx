import React, { useEffect, useState } from 'react';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Services from '../Components/Services';
import axios from 'axios';
import BlogCard from '../Components/BlogCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [recentBlogs, setRecentBlogs] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/blog?limit=3');
                setRecentBlogs(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecent();
    }, []);

    return (
        <main className="pt-20">
            <Hero />

            {/* Recent Stories Section */}
            <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black tracking-tighter">Recent <span className="gradient-text">Stories</span></h2>
                    <Link to="/blog" className="flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all">
                        <span>View All</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentBlogs.length > 0 ? (
                        recentBlogs.map(blog => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 glass rounded-3xl text-gray-400">
                            No stories published yet. Stay tuned!
                        </div>
                    )}
                </div>
            </section>

            <About />
            <Services />
        </main>
    );
};

export default Home;
