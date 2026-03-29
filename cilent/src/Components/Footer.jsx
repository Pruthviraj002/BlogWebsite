import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Ghost, Library, BookOpen, Twitter, Linkedin, Github, Send, Mail, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
    const { data: user } = useSelector(state => state.user);
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        if (!email) return toast.error("Please enter your email");
        toast.success("Welcome to the community! 🚀", {
            icon: '📩',
        });
        e.target.reset();
    };

    return (
        <footer className="relative mt-20 border-t border-white/5 bg-black">
            {/* Upper Footer - Grid */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="p-2 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl shadow-lg shadow-indigo-500/10 group-hover:rotate-6 transition-transform">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">
                                Code<span className="text-brand-primary">Stories</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Crafting a digital sanctuary for storytellers, designers, and visionaries. Join us in redefining the art of digital publishing.
                        </p>
                        <div className="flex items-center space-x-4">
                            {[
                                { icon: <Twitter size={18} />, url: "#" },
                                { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/pruthviraj-yadav-222303315?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                                { icon: <Github size={18} />, url: "https://github.com/PruthvrajYadav" }
                            ].map((social, i) => (
                                <a key={i} href={social.url} className="p-3 rounded-xl glass text-gray-400 hover:text-white hover:border-brand-primary/30 transition-all">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Navigator</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Home Feed", url: "/" },
                                { name: "About Story", url: "/about" },
                                { name: "Explore Topics", url: "/categories" },
                                { name: "Get in Touch", url: "/contact" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link to={link.url} className="text-gray-400 hover:text-brand-primary font-bold transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-brand-primary mr-0 group-hover:mr-2 transition-all"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community/User Links */}
                    <div className="space-y-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Community</h3>
                        <ul className="space-y-4">
                            {user ? (
                                <>
                                    <li><Link to="/profile" className="text-gray-400 hover:text-brand-primary font-bold transition-colors">Personal Profile</Link></li>
                                    <li><Link to="/add-blog" className="text-gray-400 hover:text-brand-primary font-bold transition-colors">Start Writing</Link></li>
                                    {user.isAdmin && <li><Link to="/admin" className="text-brand-primary font-black hover:opacity-80 transition-opacity">Command Center</Link></li>}
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="text-gray-400 hover:text-brand-primary font-bold transition-colors">Member Login</Link></li>
                                    <li><Link to="/register" className="text-gray-400 hover:text-brand-primary font-bold transition-colors">Join Society</Link></li>
                                </>
                            )}
                            <li><a href="#" className="text-gray-400 hover:text-brand-primary font-bold transition-colors">Partner Program</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Newsletter</h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Subscribe to get the latest narratives and community updates.
                        </p>
                        <form onSubmit={handleSubscribe} className="relative group">
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email Address" 
                                className="w-full glass p-4 pr-14 rounded-2xl outline-none border border-white/5 focus:border-brand-primary/30 transition-all font-medium"
                            />
                            <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-brand-primary rounded-xl text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-sm font-medium">
                        © {currentYear} CodeStories. Designed with precision.
                    </p>
                    <div className="flex items-center space-x-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
        </footer>
    );
};

export default Footer;
