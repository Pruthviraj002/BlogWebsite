import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MessageCircle, Share2, Calendar, User, ArrowLeft, Send, Bookmark, Download } from 'lucide-react';
import { updateUserInfo } from '../Slice/userSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { data: user, token } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const [blogRes, commRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/blog/${id}`),
                axios.get(`http://localhost:5000/api/blog/${id}/comments`)
            ]);
            setBlog(blogRes.data.data);
            setComments(commRes.data.data);
            if (user) {
                setIsLiked(blogRes.data.data.likes?.includes(user._id));
                const savedIds = user.savedBlogs?.map(b => typeof b === 'object' ? b._id : b) || [];
                setIsSaved(savedIds.includes(id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, user]);

    const handleLike = async () => {
        if (!token) return alert("Please login to like");
        try {
            await axios.post(`http://localhost:5000/api/blog/${id}/like`, {}, { headers: { 'auth-token': token } });
            setIsLiked(!isLiked);
            setBlog(prev => ({
                ...prev,
                likes: isLiked ? prev.likes.filter(l => l !== user._id) : [...prev.likes, user._id]
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!token) return alert("Please login to save stories");
        try {
            const res = await axios.put(`http://localhost:5000/api/user/save/${id}`, {}, { headers: { 'auth-token': token } });
            dispatch(updateUserInfo(res.data.data));
            setIsSaved(!isSaved);
        } catch (error) {
            console.error(error);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const handleDownload = async () => {
        const element = document.getElementById('blog-article');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#000000',
                logging: false,
                onclone: (clonedDoc) => {
                    const article = clonedDoc.getElementById('blog-article');
                    if (article) {
                        article.style.backgroundColor = '#111111';
                        // Inject safe CSS to override problematic modern colors
                        const style = clonedDoc.createElement('style');
                        style.innerHTML = `
                            #blog-article * {
                                color-scheme: dark !important;
                            }
                            .gradient-text {
                                background: none !important;
                                -webkit-text-fill-color: #6366f1 !important;
                                color: #6366f1 !important;
                            }
                            .glass {
                                background: rgba(255, 255, 255, 0.03) !important;
                                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                                backdrop-filter: none !important;
                            }
                            .bg-brand-primary { background-color: #6366f1 !important; }
                            .text-brand-primary { color: #6366f1 !important; }
                            .bg-brand-secondary { background-color: #a855f7 !important; }
                        `;
                        clonedDoc.head.appendChild(style);
                    }
                }
            });
            const data = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(data);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${blog.title}.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("PDF generation failed: " + error.message);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!token) return alert("Please login to comment");
        try {
            const res = await axios.post(`http://localhost:5000/api/blog/${id}/comments`, { text: newComment }, { headers: { 'auth-token': token } });
            setComments([res.data.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error(error);
        }
    };

    if (!blog) return <div className="pt-40 text-center text-gray-400">Loading story...</div>;

    return (
        <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <Link to="/blog" className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-10 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold">Back to Feed</span>
            </Link>

            <article id="blog-article" className="bg-black">
                {blog.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12 h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
                    >
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <span className="px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-bold text-brand-primary uppercase tracking-widest mb-6 inline-block">
                        {blog.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                        {blog.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-white/5 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                {blog.userId?.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{blog.userId?.name}</p>
                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar size={14} />
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{Math.ceil((blog.content?.split(' ').length || 0) / 200)} min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl transition-all font-bold ${isLiked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'glass text-gray-400 hover:text-white'}`}
                            >
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                <span>{blog.likes?.length || 0}</span>
                            </button>
                            <button
                                onClick={handleSave}
                                className={`p-3 rounded-2xl transition-all ${isSaved ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'glass text-gray-400 hover:text-white'}`}
                            >
                                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-3 rounded-2xl glass text-gray-400 hover:text-white transition-all"
                            >
                                <Share2 size={20} />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-3 rounded-2xl glass text-gray-400 hover:text-white transition-all"
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div
                    className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed space-y-6 mb-20"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Comments Section */}
                <section className="glass p-10 rounded-[2rem]">
                    <h2 className="text-2xl font-black mb-8 flex items-center space-x-3">
                        <MessageCircle size={24} className="text-brand-primary" />
                        <span>Discussion <span className="text-gray-500 ml-2">({comments.length})</span></span>
                    </h2>

                    <form onSubmit={handleComment} className="flex gap-4 mb-10">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="flex-1 glass p-4 rounded-2xl translate-y-0 focus:ring-2 ring-brand-primary/20 outline-none transition-all font-medium"
                        />
                        <button type="submit" className="p-4 bg-brand-primary rounded-2xl text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                            <Send size={20} />
                        </button>
                    </form>

                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment._id} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold uppercase">
                                        {comment.user?.name[0]}
                                    </div>
                                    <p className="font-bold text-sm">{comment.user?.name}</p>
                                    <span className="text-gray-500 text-xs">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </article>
        </main>
    );
};

export default SingleBlog;
