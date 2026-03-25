import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const HeroRight = () => {
    const containerRef = useRef();
    const cardRef = useRef();
    const floatersRef = useRef([]);

    useGSAP(() => {
        // Main card entrance
        gsap.from(cardRef.current, {
            x: 100,
            opacity: 0,
            rotate: 10,
            duration: 2,
            ease: "power4.out",
            delay: 0.5
        });

        // Floating animation for the card
        gsap.to(cardRef.current, {
            y: 20,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Small floaters animation
        floatersRef.current.forEach((el, index) => {
            if (el) {
                gsap.to(el, {
                    y: (index + 1) * -15,
                    x: (index + 1) * 10,
                    duration: 3 + index,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: index * 0.5
                });
            }
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center min-h-[400px]">
            {/* Background decorative elements */}
            <div 
                ref={el => floatersRef.current[0] = el}
                className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-brand-accent/10 blur-3xl"
            ></div>
            <div 
                ref={el => floatersRef.current[1] = el}
                className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl"
            ></div>

            {/* Main Editorial Card */}
            <div 
                ref={cardRef}
                className="relative z-10 w-full max-w-lg aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
            >
                <img 
                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop" 
                    alt="Editorial workspace" 
                    className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2000ms]"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="w-8 h-[1px] bg-white/50"></span>
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Featured Insight</span>
                    </div>
                    <h3 className="text-2xl font-serif text-white leading-tight font-medium">
                        The future of minimalist <br/> digital storytelling.
                    </h3>
                </div>

                {/* Floating "Badge" */}
                <div 
                    ref={el => floatersRef.current[2] = el}
                    className="absolute -top-6 -right-6 glass p-6 rounded-3xl shadow-xl hidden lg:block"
                >
                    <div className="text-brand-accent font-black text-2xl">2024</div>
                    <div className="text-[8px] uppercase tracking-widest font-bold opacity-60">Edition</div>
                </div>
            </div>

            {/* Tiny accent floaters */}
            <div className="absolute top-10 right-0 w-2 h-2 bg-brand-accent rounded-full animate-ping"></div>
            <div className="absolute bottom-20 left-10 w-3 h-3 border border-brand-primary/20 rounded-full"></div>
        </div>
    );
};

export default HeroRight;
