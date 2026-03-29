import { useRef, useState } from 'react';
import { Mail, Send, MapPin, Phone, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const containerRef = useRef();
    const headerRef = useRef();
    const infoRef = useRef();
    const formRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

        tl.from(headerRef.current, {
            y: -30,
            opacity: 0,
        })
            .from(infoRef.current, {
                x: -50,
                opacity: 0,
            }, "-=0.8")
            .from(formRef.current, {
                x: 50,
                opacity: 0,
            }, "-=1");
    }, { scope: containerRef });

    const handleCardHover = (e, isEnter) => {
        gsap.to(e.currentTarget, {
            scale: isEnter ? 1.02 : 1,
            y: isEnter ? -5 : 0,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, message } = formData;
        if (!name || !email || !message) {
            return toast.error("Please fill all required fields");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address");
        }

        if (message.length < 10) {
            return toast.error("Narrative must be at least 10 characters long");
        }

        try {
            setLoading(true);
            const res = await api.post('/contact', formData);
            toast.success(res.data.message || "Message sent successfully!");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main ref={containerRef} className="pt-32 pb-20 px-4 max-w-7xl mx-auto overflow-hidden bg-zinc-950 text-white min-h-screen">
            <div ref={headerRef} className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Get in <span className="gradient-text">Touch</span></h1>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">Have a question or want to collaborate? We&apos;d love to hear from you.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div ref={infoRef} className="space-y-8">
                    <div className="glass p-10 rounded-[2.5rem] space-y-10 border border-white/5 shadow-2xl bg-zinc-900/40">
                        {[
                            { icon: <Mail size={24} />, label: "Email Us", val: "pruthvirajyadav703@gmail.com", color: "brand-primary" },
                            { icon: <MapPin size={24} />, label: "Sanctuary HQ", val: "Sangli,Maharashtra", color: "brand-accent" },
                            { icon: <Phone size={24} />, label: "Call Us", val: "+91 9370894134", color: "indigo-400" }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onMouseEnter={(e) => handleCardHover(e, true)}
                                onMouseLeave={(e) => handleCardHover(e, false)}
                                className="flex items-center space-x-6 cursor-default transition-all"
                            >
                                <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/5 shadow-inner shrink-0`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-xl font-bold tracking-tight">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div ref={formRef} className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl bg-zinc-900/40">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    type="text" 
                                    placeholder="John Doe" 
                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-white placeholder:text-zinc-600" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-white placeholder:text-zinc-600" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Message Subject</label>
                            <input 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                type="text" 
                                placeholder="Collab Request" 
                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-white placeholder:text-zinc-600" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Your Narrative</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Share your thoughts..." 
                                rows="5" 
                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium text-white placeholder:text-zinc-600 resize-none"
                            ></textarea>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit"
                            className="w-full btn-modern py-5 flex items-center justify-center space-x-3 group"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span className="text-lg font-bold">Send Narrative</span>
                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Contact;
