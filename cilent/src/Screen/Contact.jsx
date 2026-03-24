import React, { useRef } from 'react';
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Contact = () => {
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

    return (
        <main ref={containerRef} className="pt-32 pb-20 px-4 max-w-7xl mx-auto overflow-hidden">
            <div ref={headerRef} className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Get in <span className="gradient-text">Touch</span></h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">Have a question or want to collaborate? We'd love to hear from you.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div ref={infoRef} className="space-y-8">
                    <div className="glass p-10 rounded-[2.5rem] space-y-10 border border-white/5 shadow-2xl">
                        {[
                            { icon: <Mail size={24} />, label: "Email Us", val: "hello@luminablog.com", color: "brand-primary" },
                            { icon: <MapPin size={24} />, label: "Sanctuary HQ", val: "123 Creative Way, Digital City", color: "brand-secondary" },
                            { icon: <Phone size={24} />, label: "Call Us", val: "+1 (555) LUMINA-00", color: "indigo-400" }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onMouseEnter={(e) => handleCardHover(e, true)}
                                onMouseLeave={(e) => handleCardHover(e, false)}
                                className="flex items-center space-x-6 cursor-default transition-all"
                            >
                                <div className={`w-14 h-14 bg-${item.color}/10 rounded-2xl flex items-center justify-center text-${item.color} shrink-0`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-xl font-bold">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div ref={formRef} className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                <input type="text" placeholder="John Doe" className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                <input type="email" placeholder="john@example.com" className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Message Subject</label>
                            <input type="text" placeholder="Collab Request" className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Your Narrative</label>
                            <textarea placeholder="Share your thoughts..." rows="5" className="w-full glass p-4 rounded-2xl outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium resize-none"></textarea>
                        </div>

                        <button className="w-full btn-modern py-5 flex items-center justify-center space-x-3 group">
                            <span className="text-lg">Send Narrative</span>
                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Contact;
