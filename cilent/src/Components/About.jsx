import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef();
    const imageRef = useRef();
    const contentRef = useRef();
    const { token } = useSelector(state => state.user);

    useGSAP(() => {
        gsap.from(imageRef.current, {
            scrollTrigger: {
                trigger: imageRef.current,
                start: "top 80%",
            },
            x: -100,
            duration: 1.5,
            ease: "power4.out"
        });

        gsap.from(contentRef.current.children, {
            scrollTrigger: {
                trigger: contentRef.current,
                start: "top 80%",
            },
            x: 100,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out",
            onComplete: () => {
                // Trigger Counters
                containerRef.current.querySelectorAll('.stat-counter').forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 0.1 },
                        ease: "power2.out",
                    });
                });
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div ref={imageRef} className="flex-1 relative">
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                            alt="Workspace"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Decorative Element */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-primary/10 blur-3xl -z-10 rounded-full"></div>
                </div>

                <div ref={contentRef} className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                            Redefining the <br />
                            <span className="gradient-text">Art of Publishing</span>
                        </h2>
                        <div className="w-20 h-1.5 bg-brand-primary rounded-full"></div>
                    </div>

                    <div className="space-y-6 text-gray-400 font-medium text-lg leading-relaxed">
                        <p>
                            CodeStories was born from a simple realization: the internet needed a sanctuary for purity in expression. We believe that great ideas deserve a stage that is as elegant as the thoughts themselves.
                        </p>
                        <p>
                            Our platform is more than just a MERN stack application; it&apos;s a testament to the power of minimalist design and high-performance engineering. Every line of code and every pixel is optimized to ensure your voice is heard clearly.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-3xl font-black text-white flex items-baseline">
                                <span className="stat-counter" data-target="99.9">0</span>
                                %
                            </p>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Uptime Glory</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white flex items-baseline">
                                <span className="stat-counter" data-target="10">0</span>
                                ms
                            </p>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Response Time</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="mt-20 max-w-7xl mx-auto border-t border-white/5 pt-20">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">Our Core <span className="gradient-text">Values</span></h2>
                    <p className="text-zinc-500 font-medium text-sm tracking-widest uppercase">The pillars of our digital sanctuary</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { title: "Uncompromising Quality", desc: "We believe every pixel and every word matters. Excellence isn't an act, it's a habit." },
                        { title: "Radical Transparency", desc: "Openness is our default state. We build in public and grow with our community." },
                        { title: "Human Centric", desc: "Technology should serve expression, not suppress it. We design for the storyteller." }
                    ].map((v, i) => (
                        <div key={i} className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-4 hover:border-brand-primary/30 transition-all duration-500">
                            <h3 className="text-xl font-bold italic tracking-tight">{v.title}</h3>
                            <p className="text-zinc-400 font-medium leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Join Us Section */}
            <div className="mt-20 max-w-5xl mx-auto glass p-12 md:p-16 rounded-[3rem] md:rounded-[4rem] border border-white/5 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Ready to Scale Your <br /><span className="gradient-text">Narrative?</span></h2>
                    <p className="text-zinc-400 font-medium text-lg max-w-2xl mx-auto">Join a community of designers, engineers, and visionaries who are redefining digital publishing.</p>
                    <Link 
                        to={token ? "/add-blog" : "/register"} 
                        className="btn-modern px-12 py-5 inline-flex items-center justify-center space-x-3 text-lg min-w-[200px]"
                    >
                        <span>Start Your Journey</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default About;
