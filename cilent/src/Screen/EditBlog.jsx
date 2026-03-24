import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const EditBlog = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { token } = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogRes, catRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/blog/${id}`),
                    axios.get('http://localhost:5000/api/blog/categories')
                ]);
                const blog = blogRes.data.data;
                setTitle(blog.title);
                setContent(blog.content);
                setImage(blog.image);
                setCategory(blog.category);
                setCategories(catRes.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/blog/${id}`,
                { title, content, category, image },
                { headers: { 'auth-token': token } }
            );
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert("Failed to update blog");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImage(res.data.imageUrl);
        } catch (error) {
            console.error(error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
    );

    return (
        <main className="pt-32 min-h-screen px-4 pb-20">
            <div className="max-w-5xl mx-auto glass p-10 rounded-[2rem]">
                <h1 className="text-4xl font-black mb-10 tracking-tight">Edit <span className="gradient-text">Story</span></h1>
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Blog Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                placeholder="The future of Web..."
                                className="w-full glass p-4 rounded-xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full glass p-4 rounded-xl outline-none font-medium"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Feature Image</label>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative glass p-4 rounded-xl flex items-center justify-center border-2 border-dashed border-white/10 hover:border-brand-primary/50 transition-all group overflow-hidden h-40">
                                {image ? (
                                    <>
                                        <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                            <button onClick={() => setImage('')} className="bg-red-500 text-white p-2 rounded-lg shadow-lg">Change Image</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-brand-primary transition-colors" />
                                        <p className="text-sm font-bold text-gray-500">Click to upload or drag image</p>
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            disabled={uploading}
                                        />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Or paste Image URL</label>
                                <div className="relative group">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                                    <input
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full glass pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium h-40 align-top"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quill-container">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Content Body</label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            className="bg-white/5 rounded-2xl overflow-hidden border-none text-white"
                        />
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            onClick={handleSubmit}
                            className="btn-modern px-12"
                        >
                            Update Narrative
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditBlog;
