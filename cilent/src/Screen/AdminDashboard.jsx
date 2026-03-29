import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Users, MessageCircle, Tag,
    Trash2, Plus, TrendingUp,
    Eye, Heart, Edit3, ShieldCheck, ShieldAlert
} from 'lucide-react';
import api from '../utils/api';
import Skeleton from '../Component/Skeleton';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [statsRes, blogsRes] = await Promise.all([
                api.get(`/admin/analytics`),
                api.get(`/blog`)
            ]);
            setStats(statsRes.data.data);
            setBlogs(blogsRes.data.data);

            if (activeTab === 'users') {
                const usersRes = await api.get(`/admin/users`);
                setUsers(usersRes.data.data);
            }
            if (activeTab === 'comments') {
                const commRes = await api.get(`/admin/comments`);
                setComments(commRes.data.data);
            }
            if (activeTab === 'categories') {
                const catRes = await api.get(`/admin/categories`);
                setCategories(catRes.data.data);
            }
            if (activeTab === 'messages') {
                const msgRes = await api.get(`/admin/messages`);
                setMessages(msgRes.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, activeTab]);

    const handleDeleteBlog = async (id) => {
        if (!window.confirm("Delete this post?")) return;
        await api.delete(`/blog/${id}`);
        fetchData();
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        await api.delete(`/admin/users/${id}`);
        fetchData();
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm("Delete this comment?")) return;
        await api.delete(`/admin/comments/${id}`);
        fetchData();
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Delete this narrative?")) return;
        await api.delete(`/admin/messages/${id}`);
        fetchData();
    };

    const handleToggleBlock = async (id) => {
        try {
            await api.put(`/admin/users/${id}/block`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update user status");
        }
    };

    const handleAddCategory = async () => {
        const name = prompt("Enter category name:");
        if (!name) return;
        try {
            await api.post(`/admin/categories`, { name });
            fetchData();
        } catch {
            alert("Failed to add category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete category?")) return;
        await api.delete(`/admin/categories/${id}`);
        fetchData();
    };

    const statsCards = [
        { label: 'Total Posts', value: stats?.totalPosts || 0, icon: <FileText className="text-indigo-400" /> },
        { label: 'Total Views', value: stats?.totalViews || 0, icon: <Eye className="text-blue-400" /> },
        { label: 'Total Likes', value: stats?.totalLikes || 0, icon: <Heart className="text-red-400" /> },
        { label: 'Community', value: stats?.totalUsers || 0, icon: <Users className="text-purple-400" /> },
    ];

    return (
        <div className="flex min-h-screen pt-20 text-zinc-300">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/5 h-[calc(100vh-80px)] sticky top-20 hidden md:block">
                <div className="p-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-zinc-500 hover:bg-white/5'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-semibold text-sm">Publications</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-zinc-500 hover:bg-white/5'}`}
                    >
                        <Users size={20} />
                        <span className="font-semibold text-sm">Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'comments' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-zinc-500 hover:bg-white/5'}`}
                    >
                        <MessageCircle size={20} />
                        <span className="font-semibold text-sm">Comments</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-zinc-500 hover:bg-white/5'}`}
                    >
                        <Mail size={20} />
                        <span className="font-semibold text-sm">Inbox</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'categories' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-zinc-500 hover:bg-white/5'}`}
                    >
                        <Tag size={20} />
                        <span className="font-semibold text-sm">Categories</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black mb-2 uppercase tracking-tight text-white">Admin <span className="gradient-text">CodeStories</span></h1>
                        <p className="text-zinc-500 font-medium">Command Center • Welcome back, manager.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/add-blog')}
                            className="btn-modern flex items-center space-x-2"
                        >
                            <Plus size={20} />
                            <span>New Post</span>
                        </button>
                        {activeTab === 'categories' && (
                            <button
                                onClick={handleAddCategory}
                                className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-3 rounded-xl transition-all font-bold flex items-center gap-2"
                            >
                                <Plus size={20} />
                                <span>New Category</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="glass p-6 rounded-3xl">
                                <Skeleton className="h-10 w-10 rounded-2xl mb-4" />
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-8 w-12" />
                            </div>
                        ))
                    ) : statsCards.map((card, i) => (
                        <div key={i} className="glass p-6 rounded-[2rem] border border-white/5 bg-zinc-900/40">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl text-white">
                                    {card.icon}
                                </div>
                                <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <TrendingUp size={12} />
                                    <span className="text-[10px] font-bold">+12%</span>
                                </div>
                            </div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black tracking-tight text-white">{card.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Content Table */}
                <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/40 shadow-2xl">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                        <h2 className="font-black text-xl uppercase tracking-widest text-white">{activeTab} Management</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                                {activeTab === 'posts' && (
                                    <tr>
                                        <th className="px-8 py-5">Article</th>
                                        <th className="px-8 py-5">Category</th>
                                        <th className="px-8 py-5 text-center">Views</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                )}
                                {activeTab === 'users' && (
                                    <tr>
                                        <th className="px-8 py-5">User</th>
                                        <th className="px-8 py-5">Email</th>
                                        <th className="px-8 py-5">Role</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                )}
                                {activeTab === 'comments' && (
                                    <tr>
                                        <th className="px-8 py-5">Comment</th>
                                        <th className="px-8 py-5">Article</th>
                                        <th className="px-8 py-5">Author</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                )}
                                {activeTab === 'messages' && (
                                    <tr>
                                        <th className="px-8 py-5">Sender</th>
                                        <th className="px-8 py-5">Subject</th>
                                        <th className="px-8 py-5">Narrative</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                )}
                                {activeTab === 'categories' && (
                                    <tr>
                                        <th className="px-8 py-5">Category Name</th>
                                        <th className="px-8 py-5">Content Count</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {activeTab === 'posts' && blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6 font-bold text-white">{blog.title}</td>
                                        <td className="px-8 py-6"><span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">{blog.category}</span></td>
                                        <td className="px-8 py-6 text-center text-zinc-400 font-medium">{blog.views || 0}</td>
                                        <td className="px-8 py-6 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => navigate(`/edit-blog/${blog._id}`)} className="p-2.5 text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDeleteBlog(blog._id)} className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'users' && users.map((u) => (
                                    <tr key={u._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6 font-bold text-white flex items-center gap-4">
                                            <div className={`w-2.5 h-2.5 rounded-full ${u.isBlocked ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                                            {u.name}
                                        </td>
                                        <td className="px-8 py-6 text-zinc-400 font-medium">{u.email}</td>
                                        <td className="px-8 py-6"><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.isAdmin ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{u.isAdmin ? 'Admin' : 'Writer'}</span></td>
                                        <td className="px-8 py-6 text-right space-x-2">
                                            {!u.isAdmin && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleBlock(u._id)}
                                                        className={`p-2.5 rounded-xl transition-all ${u.isBlocked ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20' : 'text-zinc-400 hover:text-red-400 hover:bg-red-400/10'}`}
                                                        title={u.isBlocked ? "Unblock Persona" : "Restrict Persona"}
                                                    >
                                                        {u.isBlocked ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(u._id)} className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'comments' && comments.map((c) => (
                                    <tr key={c._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6 text-zinc-200 font-medium max-w-xs truncate italic">"{c.text}"</td>
                                        <td className="px-8 py-6 font-bold text-brand-primary leading-tight">{c.blog?.title}</td>
                                        <td className="px-8 py-6 text-zinc-500 font-bold">{c.user?.name}</td>
                                        <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDeleteComment(c._id)} className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'messages' && messages.map((m) => (
                                    <tr key={m._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-white">{m.name}</p>
                                            <p className="text-[10px] text-zinc-500 font-medium">{m.email}</p>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-brand-primary">{m.subject || 'No Subject'}</td>
                                        <td className="px-8 py-6 text-zinc-400 font-medium max-w-md line-clamp-2">{m.message}</td>
                                        <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDeleteMessage(m._id)} className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'categories' && categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6 font-bold text-white uppercase tracking-widest text-xs">{cat.name}</td>
                                        <td className="px-8 py-6 text-zinc-400 font-bold">{cat.count || 0} Articles</td>
                                        <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDeleteCategory(cat._id)} className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
