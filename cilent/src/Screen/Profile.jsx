import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import BlogCard from '../Components/BlogCard';
import { User, Mail, Edit2, Save, X, Bookmark, Loader2, Camera } from 'lucide-react';
import { updateUserInfo } from '../Slice/userSlice';

const Profile = () => {
    const { data: currentUser, token } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        profilePic: ''
    });

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/me', {
                headers: { 'auth-token': token }
            });
            setProfileData(res.data.data);
            setFormData({
                name: res.data.data.name,
                email: res.data.data.email,
                bio: res.data.data.bio || '',
                profilePic: res.data.data.profilePic || ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchProfile();
    }, [token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/user/${currentUser._id}`, formData, {
                headers: { 'auth-token': token }
            });
            dispatch(updateUserInfo(res.data.data)); // Update Redux
            setProfileData(prev => ({ ...prev, ...res.data.data })); // Update Local State
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    };

    if (!token) return <div className="pt-40 text-center text-gray-400">Please login to view profile.</div>;
    if (loading) return <div className="pt-40 flex justify-center"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;

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
                                <img src={profileData.profilePic} alt={profileData.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{profileData?.name}</h1>
                            <div className="flex items-center justify-center md:justify-start text-gray-400 gap-2">
                                <Mail size={16} />
                                <span>{profileData?.email}</span>
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

                    {/* Edit Button */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2 font-medium"
                    >
                        <Edit2 size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>

            {/* Saved Blogs Section */}
            <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Bookmark className="text-brand-primary" />
                    <span>Saved Stories</span>
                </h2>

                {profileData?.savedBlogs?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profileData.savedBlogs.map(blog => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass rounded-3xl">
                        <p className="text-gray-400 text-lg">You haven't saved any stories yet.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass w-full max-w-lg rounded-3xl p-8 relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-8">Edit Profile</h2>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full glass p-4 rounded-xl outline-none focus:ring-2 ring-brand-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full glass p-4 rounded-xl outline-none focus:ring-2 ring-brand-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full glass p-4 rounded-xl outline-none focus:ring-2 ring-brand-primary/20 resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Profile Image URL</label>
                                <div className="relative">
                                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        value={formData.profilePic}
                                        onChange={e => setFormData({ ...formData, profilePic: e.target.value })}
                                        className="w-full glass pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 ring-brand-primary/20"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-brand-primary rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
