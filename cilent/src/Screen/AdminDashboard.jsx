import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, FileText, Users, MessageSquare, Plus, Trash2, Edit3, TrendingUp, Eye, Heart, ShieldAlert, ShieldCheck, Tag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [statsRes, blogsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/analytics', { headers: { 'auth-token': token } }),
                axios.get('http://localhost:5000/api/blog')
            ]);
            setStats(statsRes.data.data);
            setBlogs(blogsRes.data.data);

            if (activeTab === 'users') {
                const usersRes = await axios.get('http://localhost:5000/api/admin/users', { headers: { 'auth-token': token } });
                setUsers(usersRes.data.data);
            }
            if (activeTab === 'comments') {
                const commRes = await axios.get('http://localhost:5000/api/admin/comments', { headers: { 'auth-token': token } });
                setComments(commRes.data.data);
            }
            if (activeTab === 'categories') {
                const catRes = await axios.get('http://localhost:5000/api/admin/categories', { headers: { 'auth-token': token } });
                setCategories(catRes.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, activeTab]);

    const handleDeleteBlog = async (id) => {
        if (!window.confirm("Delete this post?")) return;
        await axios.delete(`http://localhost:5000/api/blog/${id}`, { headers: { 'auth-token': token } });
        fetchData();
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers: { 'auth-token': token } });
        fetchData();
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm("Delete this comment?")) return;
        await axios.delete(`http://localhost:5000/api/admin/comments/${id}`, { headers: { 'auth-token': token } });
        fetchData();
    };

    const handleToggleBlock = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/block`, {}, { headers: { 'auth-token': token } });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update user status");
        }
    };

    const handleAddCategory = async () => {
        const name = prompt("Enter category name:");
        if (!name) return;
        try {
            await axios.post('http://localhost:5000/api/admin/categories', { name }, { headers: { 'auth-token': token } });
            fetchData();
        } catch (error) {
            alert("Failed to add category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete category?")) return;
        await axios.delete(`http://localhost:5000/api/admin/categories/${id}`, { headers: { 'auth-token': token } });
        fetchData();
    };

    const statsCards = [
        { label: 'Total Posts', value: stats?.totalPosts || 0, icon: <FileText className="text-indigo-400" /> },
        { label: 'Total Views', value: stats?.totalViews || 0, icon: <Eye className="text-blue-400" /> },
        { label: 'Total Likes', value: stats?.totalLikes || 0, icon: <Heart className="text-red-400" /> },
        { label: 'Community', value: stats?.totalUsers || 0, icon: <Users className="text-purple-400" /> },
    ];

    return (
        <div className="flex min-h-screen pt-20">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/5 h-[calc(100vh-80px)] sticky top-20 hidden md:block">
                <div className="p-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-semibold">Publications</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Users size={20} />
                        <span className="font-semibold">Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'comments' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <MessageSquare size={20} />
                        <span className="font-semibold">Comments</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'categories' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Tag size={20} />
                        <span className="font-semibold">Categories</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider">Admin <span className="text-brand-primary">Lumina</span></h1>
                        <p className="text-gray-500">Welcome back, manager.</p>
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
                    {statsCards.map((card, i) => (
                        <div key={i} className="glass p-6 rounded-3xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    {card.icon}
                                </div>
                                <TrendingUp className="text-green-500" size={16} />
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                            <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Content Table */}
                <div className="glass rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="font-bold text-xl uppercase tracking-widest">{activeTab} Management</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-500">
                                {activeTab === 'posts' && (
                                    <tr>
                                        <th className="px-6 py-4">Article</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Views</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                )}
                                {activeTab === 'users' && (
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                )}
                                {activeTab === 'comments' && (
                                    <tr>
                                        <th className="px-6 py-4">Comment</th>
                                        <th className="px-6 py-4">Article</th>
                                        <th className="px-6 py-4">Author</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {activeTab === 'posts' && blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">{blog.title}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-bold">{blog.category}</span></td>
                                        <td className="px-6 py-4 text-gray-400">{blog.views || 0}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => navigate(`/edit-blog/${blog._id}`)} className="p-2 text-gray-400 hover:text-brand-primary transition-colors"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDeleteBlog(blog._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'users' && users.map((u) => (
                                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
                                            {u.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-bold ${u.isAdmin ? 'bg-indigo-500/10 text-indigo-400' : 'bg-green-500/10 text-green-400'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {!u.isAdmin && (
                                                <>
                                                    <button
                                                        onClick={() => handleToggleBlock(u._id)}
                                                        className={`p-2 transition-colors ${u.isBlocked ? 'text-red-500 hover:text-green-500' : 'text-gray-400 hover:text-red-500'}`}
                                                        title={u.isBlocked ? "Unblock User" : "Block User"}
                                                    >
                                                        {u.isBlocked ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'comments' && comments.map((c) => (
                                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-300 max-w-xs truncate">{c.text}</td>
                                        <td className="px-6 py-4 font-medium text-brand-primary">{c.blog?.title}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.user?.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteComment(c._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'categories' && categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">{cat.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{cat.count || 0} Articles</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
