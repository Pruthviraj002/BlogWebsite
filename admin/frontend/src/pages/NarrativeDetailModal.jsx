import { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, Loader2, Eye, Heart } from 'lucide-react';
import api from '../utils/api';

const NarrativeDetailModal = ({ blogId, onClose }) => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/blogs/${blogId}`);
                setBlog(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (blogId) fetchBlog();
    }, [blogId]);

    if (!blogId) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="glass w-full max-w-5xl max-h-[92vh] rounded-[3rem] overflow-hidden flex flex-col relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all z-20 border border-white/5"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-40">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-brand-primary" size={48} />
                            <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Fetching Narrative...</p>
                        </div>
                    </div>
                ) : blog ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Cover Image Section */}
                        <div className="relative h-[400px] w-full group">
                            {blog.image ? (
                                <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                    <FileText size={80} className="text-zinc-700" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-12 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        {blog.category}
                                    </span>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${blog.status === 'Published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                        {blog.status}
                                    </span>
                                </div>
                                <h2 className="text-5xl font-black text-white leading-tight max-w-4xl">{blog.title}</h2>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-12 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Sidebar Info */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                                    <div className="space-y-4">
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Author</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center overflow-hidden border border-brand-primary/20">
                                                {blog.userId?.profilePic ? (
                                                    <img src={blog.userId.profilePic} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-brand-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{blog.userId?.name || 'Anonymous'}</p>
                                                <p className="text-[10px] text-zinc-500 font-medium">{blog.userId?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="space-y-4">
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Performance</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <Eye size={16} className="text-zinc-500" />
                                                <span className="text-sm font-bold">{blog.views || 0} Views</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <Heart size={16} className="text-zinc-500" />
                                                <span className="text-sm font-bold">{blog.likes?.length || 0} Likes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="space-y-4">
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Published On</p>
                                        <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                                            <Calendar size={16} className="text-zinc-500" />
                                            <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Blog Body */}
                            <div className="lg:col-span-3">
                                <article 
                                    className="prose prose-invert prose-brand max-w-none 
                                    prose-headings:text-white prose-headings:font-black 
                                    prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-lg
                                    prose-strong:text-white prose-a:text-brand-primary"
                                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                                />
                                
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-2">
                                        {blog.tags.map(tag => (
                                            <span key={tag} className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-bold hover:text-white transition-colors">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center text-zinc-500 font-medium">
                        Failed to load narrative details.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NarrativeDetailModal;
