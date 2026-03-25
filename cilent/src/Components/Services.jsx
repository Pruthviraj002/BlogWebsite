import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Command, Shield, BarChart3, Feather, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    console.log("Services component rendering...");
    const container = useRef();
    const cardsRef = useRef([]);

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
        },
        {
            icon: <Zap size={24} className="text-orange-400" />,
            title: "SEO Optimized",
            desc: "Automatically generated meta tags and clean URL structures for search engines."
        },
        {
            icon: <Feather size={24} className="text-cyan-400" />,
            title: "Responsive Design",
            desc: "Flawless experience across desktop, tablet, and mobile devices."
        },
        {
            icon: <Shield size={24} className="text-rose-400" />,
            title: "Image Optimization",
            desc: "Automatic resizing and Cloudinary integration for lightning-fast media."
        }
    ];

    useGSAP(() => {
        // Ensure cards are visible immediately if GSAP fails
        gsap.set(cardsRef.current, { opacity: 1, y: 0, scale: 1 });

        gsap.from(cardsRef.current, {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            scale: 0.98,
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out"
        });
    }, { scope: container, dependencies: [] });

    return (
        <section ref={container} className="py-16 px-6 lg:px-12 bg-zinc-950 text-white overflow-hidden border-t border-white/5">
            <div className="max-w-screen-2xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white">
                        Engineered for <span className="gradient-text">Excellence</span>
                    </h2>
                    <p className="text-zinc-400 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                        A minimalist core built with high-performance engineering, providing the essential tools to scale your narrative with precision and style.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className="glass p-8 rounded-[2rem] group hover:border-brand-primary/30 transition-all duration-500 flex flex-col items-start"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-3 group-hover:text-brand-accent transition-colors">{f.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
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
