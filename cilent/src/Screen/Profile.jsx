import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Bookmark, Edit2, X, Camera, Save, Loader2, User, Edit3, Trash2, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserInfo, toggleEditModal } from '../Slice/userSlice';
import { getSafeImageUrl } from '../config';
import BlogCard from '../Components/BlogCard';
import api from '../utils/api';

const Profile = () => {
    const { id } = useParams();
    const { data: currentUser, token } = useSelector(state => state.user);
    const isMyProfile = !id || id === currentUser?._id;
    
    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('published');
    const [userBlogs, setUserBlogs] = useState([]);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const endpoint = isMyProfile ? `/user/me` : `/user/${id}`;
            const res = await api.get(endpoint);
            setProfileData(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBlogs = async () => {
        try {
            const authorId = isMyProfile ? currentUser?._id : id;
            if (!authorId) return;
            const res = await api.get(`/blog?authorId=${authorId}`);
            setUserBlogs(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isMyProfile && !token) return;
        fetchProfile();
        fetchUserBlogs();
    }, [id, token]);

    const handleDeleteBlog = async (id) => {
        if (!window.confirm("Are you sure you want to delete this story? This narrative will be lost forever.")) return;
        try {
            await api.delete(`/blog/${id}`);
            fetchUserBlogs();
            alert("Story deleted successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to delete story.");
        }
    };

    if (isMyProfile && !token) return <div className="pt-40 text-center text-gray-400">Please login to view profile.</div>;
    if (loading) return <div className="pt-40 flex justify-center"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;

    if (!profileData) {
        return (
            <div className="pt-40 text-center space-y-4">
                <User size={64} className="mx-auto text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-300">User not found</h2>
                <button onClick={() => navigate('/blog')} className="text-brand-primary hover:underline">Back to Feed</button>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="glass rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    {/* Avatar */}
                    <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary p-[2px] shadow-2xl">
                        <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                            {profileData?.profilePic ? (
                                <img src={getSafeImageUrl(profileData.profilePic)} alt={profileData.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-gray-400" />
                            )}
                        </div>
                        {/* Status Dot */}
                        <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-4 border-[#0a0a0a] ${
                            profileData?.isOnline && (new Date() - new Date(profileData?.lastSeen) < 300000) 
                            ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                            : 'bg-zinc-600'
                        }`} title={profileData?.isOnline ? "Online" : "Offline"} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 
                                onClick={() => isMyProfile && dispatch(toggleEditModal(true))} 
                                className={`text-4xl font-bold mb-2 ${isMyProfile ? 'cursor-pointer hover:text-brand-primary transition-colors' : ''}`}
                            >
                                {profileData?.name}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start text-gray-400 gap-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>{profileData?.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        profileData?.isOnline && (new Date() - new Date(profileData?.lastSeen) < 300000) 
                                        ? 'bg-green-500 animate-pulse' 
                                        : 'bg-zinc-500'
                                    }`} />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {profileData?.isOnline && (new Date() - new Date(profileData?.lastSeen) < 300000) 
                                        ? 'Active Now' 
                                        : `Last active ${new Date(profileData?.lastSeen).toLocaleDateString()}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {profileData?.bio && (
                            <p className="text-lg text-gray-300 max-w-2xl">{profileData.bio}</p>
                        )}

                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <Bookmark size={16} className="text-brand-primary" />
                                <span className="font-bold">{profileData?.savedBlogs?.length || 0}</span>
                                <span className="text-gray-400 text-sm">Saved</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button & Social Links */}
                    <div className="flex flex-col gap-4">
                        {isMyProfile && (
                            <button
                                onClick={() => dispatch(toggleEditModal(true))}
                                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2 font-medium justify-center"
                            >
                                <Edit2 size={18} />
                                <span>Edit Profile</span>
                            </button>
                        )}
                        
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            {profileData?.socialLinks?.twitter && (
                                <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-primary/20 hover:text-brand-primary transition-all">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            )}
                            {profileData?.socialLinks?.linkedin && (
                                <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-primary/20 hover:text-brand-primary transition-all">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                            )}
                            {profileData?.socialLinks?.github && (
                                <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-primary/20 hover:text-brand-primary transition-all">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center space-x-8 mb-12 border-b border-white/5">
                {[
                    { id: 'published', label: isMyProfile ? 'My Stories' : 'Stories', icon: <FileText size={18} /> },
                    ...(isMyProfile ? [{ id: 'saved', label: 'Saved Collection', icon: <Bookmark size={18} /> }] : [])
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                        )}
                    </button>
                ))}
            </div>

            {/* Dynamic Content Section */}
            <div className="min-h-[400px]">
                {activeTab === 'published' ? (
                    <div>
                        {userBlogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {userBlogs.map(blog => (
                                    <BlogCard 
                                        key={blog._id} 
                                        blog={blog} 
                                        actions={
                                            <>
                                                <button 
                                                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
                                                    className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all border border-white/5"
                                                    title="Edit Story"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteBlog(blog._id)}
                                                    className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                                                    title="Delete Story"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 glass rounded-[3rem] border border-white/5">
                                <FileText size={48} className="mx-auto text-gray-700 mb-4" />
                                <p className="text-gray-400 text-lg font-medium mb-6">You haven&apos;t published any narratives yet.</p>
                                <button onClick={() => navigate('/add-blog')} className="btn-modern px-8 py-3">Start Writing</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {profileData?.savedBlogs?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {profileData.savedBlogs.map(blog => (
                                    <BlogCard key={blog._id} blog={blog} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 glass rounded-[3rem] border border-white/5">
                                <Bookmark size={48} className="mx-auto text-gray-700 mb-4" />
                                <p className="text-gray-400 text-lg font-medium">Your reading list is currently empty.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default Profile;
