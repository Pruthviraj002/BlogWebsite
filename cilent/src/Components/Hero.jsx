import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const container = useRef();
    const titleRef = useRef();
    const subTitleRef = useRef();
    const lineRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.from(subTitleRef.current, {
            y: 20,
            opacity: 0,
            duration: 1.2,
            delay: 0.3
        })
        .from(lineRef.current, {
            width: 0,
            duration: 1,
        }, "-=0.8")
        .from(titleRef.current.querySelectorAll('.word'), {
            y: 100,
            stagger: 0.1,
            duration: 1.5,
            ease: "power4.out"
        }, "-=0.8");

    }, { scope: container });

    return (
        <section ref={container} className="relative pt-32 pb-48 px-6 lg:px-12 overflow-hidden bg-white dark:bg-black">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col items-start text-left">
                    <div ref={subTitleRef} className="flex items-center space-x-4 mb-8">
                        <span className="section-label mb-0 italic">Est. 2024</span>
                        <div ref={lineRef} className="h-[1px] w-12 bg-zinc-300 dark:bg-zinc-800"></div>
                        <span className="text-xs font-medium text-zinc-500 tracking-wide">Journal of thoughts</span>
                    </div>

                    <h1
                        ref={titleRef}
                        className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.9] tracking-tighter mb-16"
                    >
                        <div className="overflow-hidden">
                            <span className="word inline-block">CRAFTING</span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="word inline-block italic font-serif text-brand-accent">STORIES</span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="word inline-block">BEYOND</span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="word inline-block">LIMITS</span>
                        </div>
                    </h1>

                    <div className="flex flex-col lg:flex-row items-end justify-between w-full border-t border-zinc-100 dark:border-zinc-900 pt-12">
                        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed mb-12 lg:mb-0">
                            A minimalist sanctuary where high-performance engineering meets the art of digital storytelling. 
                            Curated insights for the modern visionary.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <Link 
                                to="/blog" 
                                className="group relative flex items-center gap-2 text-sm font-bold uppercase tracking-widest link-underline py-2"
                            >
                                Browse Journal
                                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                            
                            <Link to="/register" className="btn-editorial">
                                Join Fellowship
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Texture - Subtle enough for "manual" feel */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
