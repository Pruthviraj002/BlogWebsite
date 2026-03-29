import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { loginStart, loginSuccess, loginFailure } from '../Slice/userSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cardRef = useRef();

    useGSAP(() => {
        gsap.from(cardRef.current, {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        });
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            return toast.error("Please fill all fields");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address");
        }

        dispatch(loginStart());
        try {
            const res = await api.post(`/user/login`, { email, password });
            dispatch(loginSuccess(res.data.data)); 
            toast.success(`Welcome back!`);
            navigate('/');
        } catch (err) {
            const errMsg = err.response?.data?.message || "Login failed";
            dispatch(loginFailure(errMsg));
            toast.error(errMsg);
        }
    };

    return (
        <main className="pt-20 min-h-screen flex items-center justify-center p-4 auth-bg">
            <div ref={cardRef} className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden bg-[#0d0d0d]/80 backdrop-blur-3xl border-white/5">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Welcome <span className="gradient-text">Back</span></h1>
                    <p className="text-gray-500 font-medium">Continue your CodeStories journey.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@codestories.com"
                                className="w-full glass pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full glass pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button
                        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.3 })}
                        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-modern py-4 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-gray-500 font-medium pt-4">
                        New here? <Link to="/register" className="text-brand-primary hover:underline font-bold">Create account</Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Login;
