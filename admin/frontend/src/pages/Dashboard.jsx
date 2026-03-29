import { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, blogsRes, usersRes] = await Promise.all([
                api.get('/stats'),
                api.get('/blogs'),
                api.get('/users')
            ]);
            setStats(statsRes.data.data);
            setRecentBlogs(blogsRes.data.data.slice(0, 5));
            setRecentUsers(usersRes.data.data.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
    );

    const statCards = [
        { label: 'Active Users', value: stats?.totalUsers || 0, color: 'text-indigo-400' },
        { label: 'Total Stories', value: stats?.totalBlogs || 0, color: 'text-purple-400' },
        { label: 'Global Views', value: stats?.totalViews || 0, color: 'text-rose-400' },
        { label: 'Total Likes', value: stats?.totalLikes || 0, color: 'text-orange-400' },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">System Status</h2>
                    <p className="text-zinc-500 font-medium">Monitoring platform health & engagement.</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                   <div>
                       <p className="font-bold text-sm">Administrator</p>
                       <p className="text-zinc-500 text-xs text-brand-primary">Full Permission Access</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                       <Users size={20} className="text-zinc-400" />
                   </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value.toLocaleString()}</h3>
                            <div className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded-lg text-zinc-400">LIVE</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">Recent Narratives</h3>
                    </div>
                    <div className="space-y-4">
                        {recentBlogs.map(blog => (
                            <div key={blog._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                                        {blog.image && <img src={blog.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                    <div>
                                        <p className="font-bold truncate max-w-[200px]">{blog.title}</p>
                                        <p className="text-xs text-zinc-500">by {blog.userId?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${blog.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {blog.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xl font-bold mb-8">User Activity</h3>
                    <div className="space-y-6">
                        {recentUsers.map(user => (
                            <div key={user._id} className="flex gap-4 group">
                                <div className={`w-2 h-2 rounded-full mt-2 ring-4 ${user.isBlocked ? 'bg-red-500 ring-red-500/10' : 'bg-brand-primary ring-brand-primary/10'}`}></div>
                                <div>
                                    <p className="text-sm font-bold">{user.name}</p>
                                    <p className="text-xs text-zinc-500 underline decoration-white/5">{user.email}</p>
                                    <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-tighter">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
