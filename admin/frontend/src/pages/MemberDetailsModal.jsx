import { useState, useEffect } from 'react';
import { X, Mail, Calendar, User, FileText, Eye, Heart, Loader2 } from 'lucide-react';
import api from '../utils/api';
import NarrativeDetailModal from './NarrativeDetailModal';

const MemberDetailsModal = ({ userId, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingBlogId, setViewingBlogId] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/users/${userId}`);
                setData(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchDetails();
    }, [userId]);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col relative border border-white/10 shadow-2xl">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all z-20"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-brand-primary" size={40} />
                    </div>
                ) : data ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Header Gradient */}
                        <div className="h-32 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 relative">
                            <div className="absolute -bottom-12 left-12">
                                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center overflow-hidden shadow-xl">
                                    {data.user.profilePic ? (
                                        <img src={data.user.profilePic} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-zinc-600" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 px-12 pb-12 space-y-10">
                            {/* User Info */}
                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-4xl font-black text-white">{data.user.name}</h2>
                                            <div className={`w-3 h-3 rounded-full mt-2 ${
                                                data.user.isOnline && (new Date() - new Date(data.user.lastSeen) < 300000) 
                                                ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                                                : 'bg-zinc-600'
                                            }`} title={data.user.isOnline ? "Online" : "Offline"} />
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-zinc-400 font-medium">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Mail size={14} />
                                                <span>{data.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Calendar size={14} />
                                                <span>Joined {new Date(data.user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${data.user.isBlocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                        {data.user.isBlocked ? 'Blocked' : 'Active Member'}
                                    </span>
                                </div>
                                {data.user.bio && (
                                    <p className="text-zinc-300 leading-relaxed max-w-2xl">{data.user.bio}</p>
                                )}
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Narratives</p>
                                    <p className="text-3xl font-black text-white">{data.blogs.length}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Views</p>
                                    <p className="text-3xl font-black text-white">
                                        {data.blogs.reduce((sum, b) => sum + (b.views || 0), 0)}
                                    </p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Likes</p>
                                    <p className="text-3xl font-black text-white">
                                        {data.blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0)}
                                    </p>
                                </div>
                            </div>

                            {/* Blog List */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-zinc-100 font-black text-xl">
                                    <FileText size={20} className="text-brand-primary" />
                                    <h3>Published Narratives</h3>
                                </div>

                                {data.blogs.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {data.blogs.map(blog => (
                                            <div 
                                                key={blog._id} 
                                                onClick={() => setViewingBlogId(blog._id)}
                                                className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group flex items-center justify-between cursor-pointer"
                                            >
                                                <div className="space-y-2">
                                                    <h4 className="font-bold text-lg text-zinc-100 group-hover:text-brand-primary transition-colors">{blog.title}</h4>
                                                    <div className="flex items-center gap-4 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                                        <span>{blog.category}</span>
                                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                                        <span className={blog.status === 'Published' ? 'text-green-500' : 'text-zinc-500'}>{blog.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Eye size={16} />
                                                        <span className="text-sm font-bold">{blog.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Heart size={16} />
                                                        <span className="text-sm font-bold">{blog.likes?.length || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                        <p className="text-zinc-500 font-medium">This member hasn't published any narratives yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center text-zinc-500 font-medium">
                        Failed to load member details.
                    </div>
                )}
            </div>

            {/* Narrative Content Viewer */}
            <NarrativeDetailModal 
                blogId={viewingBlogId} 
                onClose={() => setViewingBlogId(null)} 
            />
        </div>
    );
};

export default MemberDetailsModal;
