import { useState } from 'react';
import { Package, Mail, Lock, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', { 
                email: email.trim(), // Trim whitespace
                password 
            });
            
            if (res.data.success) {
                const token = res.data.token;
                localStorage.setItem('auth-token', token);
                setToken(token);
            } else {
                setError(res.data.message || "Login failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials or Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-brand-primary/30">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <Package className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Admin <span className="text-brand-primary">Portal</span></h1>
                    <p className="text-zinc-500 font-medium">Restricted access for authorized personnel only.</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
                            <ShieldCheck size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 ring-brand-primary/20 focus:border-brand-primary/20 transition-all font-medium"
                                    placeholder="admin@codestories.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm outline-none focus:ring-2 ring-brand-primary/20 focus:border-brand-primary/20 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authenticate Access"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-10">
                    &copy; 2026 CodeStories Ecosystem • Secure Internal Tool
                </p>
            </div>
        </div>
    );
};

export default Login;
