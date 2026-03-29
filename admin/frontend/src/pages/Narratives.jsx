import { useState, useEffect } from 'react';
import { Loader2, Trash2, Mail, Calendar, User, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import NarrativeDetailModal from './NarrativeDetailModal';

const Narratives = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/blogs');
            setBlogs(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this narrative?")) return;
        try {
            await api.delete(`/blogs/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error(error);
            alert("Failed to delete blog");
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Narratives</h2>
                    <p className="text-zinc-500 font-medium">Manage and moderate all blog posts.</p>
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            <th className="p-6">Author/Article</th>
                            <th className="p-6">Date</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                                            {blog.image && <img src={blog.image} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-100 group-hover:text-brand-primary transition-colors">{blog.title}</p>
                                            <p className="text-xs text-zinc-500 font-medium">{blog.userId?.name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-zinc-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${blog.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            title="Delete Narrative"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setSelectedBlogId(blog._id)}
                                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-brand-primary transition-all" 
                                            title="View Story Insights"
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {blogs.length === 0 && <div className="p-20 text-center text-zinc-500">No narratives found.</div>}
            </div>

            {/* Narrative Detail Modal */}
            <NarrativeDetailModal 
                blogId={selectedBlogId} 
                onClose={() => setSelectedBlogId(null)} 
            />
        </div>
    );
};

export default Narratives;
