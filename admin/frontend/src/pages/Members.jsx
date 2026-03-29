import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, ShieldAlert, Trash2, Mail, Calendar, User, Search, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import MemberDetailsModal from './MemberDetailsModal';

const Members = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    const getStatus = (user) => {
        const isOnline = user.isOnline && (new Date() - new Date(user.lastSeen) < 300000); // 5 mins
        return isOnline ? 'Online' : 'Offline';
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (id) => {
        try {
            const res = await api.patch(`/users/block/${id}`);
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
            toast.success(res.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this member and all their stories?")) return;
        try {
            const res = await api.delete(`/users/${id}`);
            fetchUsers();
            toast.success(res.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete member");
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Members</h2>
                    <p className="text-zinc-500 font-medium">Monitor and manage access for all users.</p>
                </div>
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest text-center">
                            <th className="p-6 text-left">Member</th>
                            <th className="p-6">Activity</th>
                            <th className="p-6">Role</th>
                            <th className="p-6">Access</th>
                            <th className="p-6">Joined</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                            {user.profilePic ? (
                                                <img src={user.profilePic} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-100">{user.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Mail size={12} />
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getStatus(user) === 'Online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-600'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${getStatus(user) === 'Online' ? 'text-green-500' : 'text-zinc-500'}`}>
                                                {getStatus(user)}
                                            </span>
                                        </div>
                                        {getStatus(user) === 'Offline' && user.lastSeen && (
                                            <span className="text-[9px] text-zinc-600 font-bold uppercase">
                                                {new Date(user.lastSeen).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${user.isAdmin ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {user.isAdmin ? 'Administrator' : 'General User'}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {user.isBlocked ? (
                                            <ShieldAlert size={16} className="text-red-500" />
                                        ) : (
                                            <ShieldCheck size={16} className="text-green-500" />
                                        )}
                                        <span className={`text-xs font-bold ${user.isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Verified'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6 text-center text-sm text-zinc-400 font-medium">
                                    <div className="flex items-center justify-center gap-2 text-xs">
                                        <Calendar size={14} />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleToggleBlock(user._id)}
                                            className={`p-2 rounded-lg transition-all ${user.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400 hover:text-red-400'}`}
                                            title={user.isBlocked ? "Unblock" : "Block Access"}
                                        >
                                            {user.isBlocked ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                                        </button>
                                        
                                        <button 
                                            onClick={() => setSelectedUserId(user._id)}
                                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                                            title="View Member Insights"
                                        >
                                            <ExternalLink size={16} />
                                        </button>

                                        {!user.isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                title="Remove Member"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Member Details Modal */}
            <MemberDetailsModal 
                userId={selectedUserId} 
                onClose={() => setSelectedUserId(null)} 
            />
        </div>
    );
};

export default Members;
