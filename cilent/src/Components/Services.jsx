import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Command, Shield, BarChart3, Feather, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const container = useRef();
    const cardsRef = useRef([]);

    useGSAP(() => {
        gsap.from(cardsRef.current, {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)"
        });
    }, { scope: container });

    const features = [
        {
            icon: <Zap size={24} className="text-yellow-400" />,
            title: "Lightning Performance",
            desc: "Optimized MERN architecture ensuring sub-second load times."
        },
        {
            icon: <Feather size={24} className="text-indigo-400" />,
            title: "Rich Composing",
            desc: "Full-featured text editor with real-time formatting and media support."
        },
        {
            icon: <Shield size={24} className="text-green-400" />,
            title: "Secured by JWT",
            desc: "Enterprise-grade authentication and role-based access control."
        },
        {
            icon: <BarChart3 size={24} className="text-blue-400" />,
            title: "Insights Dashboard",
            desc: "Detailed analytics for views, likes, and engagement tracking."
        },
        {
            icon: <Command size={24} className="text-purple-400" />,
            title: "Command Center",
            desc: "Centralized moderation panel for posts, comments, and members."
        },
        {
            icon: <MessageSquare size={24} className="text-pink-400" />,
            title: "Discussion Hub",
            desc: "Engaging comment system to foster community conversations."
        }
    ];

    return (
        <section ref={container} className="py-24 px-6 lg:px-8 bg-black/20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black mb-4 tracking-tighter">Engineered for <span className="gradient-text">Excellence</span></h2>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto">Powerful features wrapped in a minimalist core, giving you everything you need to scale your narrative.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className="glass p-10 rounded-[2.5rem] group hover:border-brand-primary/30 transition-all duration-500"
                        >
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
