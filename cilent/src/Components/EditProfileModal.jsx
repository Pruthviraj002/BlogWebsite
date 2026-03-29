import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Camera, Save, Loader2 } from 'lucide-react';
import { toggleEditModal, updateUserInfo } from '../Slice/userSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { getSafeImageUrl } from '../config';


const EditProfileModal = () => {
    const dispatch = useDispatch();
    const { data: user, isEditModalOpen } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        profilePic: '',
        socialLinks: {
            twitter: '',
            linkedin: '',
            github: ''
        }
    });

    useEffect(() => {

        if (user && isEditModalOpen) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                profilePic: user.profilePic || '',
                socialLinks: user.socialLinks || { twitter: '', linkedin: '', github: '' }
            });
        }
    }, [user, isEditModalOpen]);


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setFormData(prev => ({ ...prev, profilePic: res.data.imageUrl }));
            toast.success("Identity visual updated!");
        } catch (error) {
            console.error(error);
            toast.error("Visual upload failed");
        } finally {
            setUploading(false);
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.put(`/user/${user._id}`, formData);
            dispatch(updateUserInfo(res.data.data));
            dispatch(toggleEditModal(false));
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!isEditModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 relative animate-in fade-in zoom-in duration-300 border border-white/10">
                <button
                    onClick={() => dispatch(toggleEditModal(false))}
                    className="absolute top-8 right-8 p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl"
                >
                    <X size={20} />
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-2">Update <span className="gradient-text">Identity</span></h2>
                    <p className="text-gray-400 text-sm font-medium">Refine your public persona across CodeStories.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Your Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium resize-none"
                            placeholder="Architect of digital narratives..."
                        />
                    </div>

                    <div className="flex flex-col items-center mb-10 group/avatar relative">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 p-1 relative overflow-hidden transition-all group-hover/avatar:border-brand-primary/50 shadow-2xl">
                            {formData.profilePic ? (
                                <img 
                                    src={getSafeImageUrl(formData.profilePic)} 
                                    className="w-full h-full object-cover rounded-[2rem]" 
                                    alt="Preview" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                    <Camera size={40} />
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="animate-spin text-brand-primary" size={24} />
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            id="avatar-upload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <label 
                            htmlFor="avatar-upload"
                            className="absolute -bottom-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-tighter px-4 py-2 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/30"
                        >
                            Change Visual
                        </label>
                    </div>


                    <div className="space-y-4 pt-2 border-t border-white/5">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Social Ecosystem</label>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                value={formData.socialLinks.twitter}
                                onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                                className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-sm"
                                placeholder="Twitter (X) URL"
                            />
                            <input
                                type="text"
                                value={formData.socialLinks.linkedin}
                                onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                                className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-sm"
                                placeholder="LinkedIn URL"
                            />
                            <input
                                type="text"
                                value={formData.socialLinks.github}
                                onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                                className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-sm"
                                placeholder="GitHub URL"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-primary rounded-2xl text-white font-black tracking-widest uppercase text-xs shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>Synchronize Changes</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
