import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, MessageCircle, ArrowUpRight, Clock } from 'lucide-react';
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { getSafeImageUrl } from '../config';

gsap.registerPlugin(ScrollTrigger);

import { useSelector, useDispatch } from 'react-redux';
import { toggleEditModal } from '../Slice/userSlice';

const BlogCard = ({ blog, actions }) => {
    const cardRef = useRef();
    const imageRef = useRef();
    const { data: user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleAuthorClick = (e) => {
        if (user && blog.userId?._id === user._id) {
            e.preventDefault();
            dispatch(toggleEditModal(true));
        }
    };


    useGSAP(() => {
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 95%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "expo.out"
        });
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className="editorial-card group flex flex-col h-full bg-white dark:bg-zinc-950"
        >
            <Link to={`/blog/${blog._id}`} className="block relative aspect-[16/10] overflow-hidden">
                <img
                    ref={imageRef}
                    src={getSafeImageUrl(blog.image) || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/90 text-[10px] font-bold uppercase tracking-widest text-brand-primary dark:text-white border border-black/5">
                        {blog.category}
                    </span>
                </div>
            </Link>

            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                    <Clock size={12} />
                    <span>{Math.ceil((blog.content?.split(' ').length || 0) / 200)} MIN READ</span>
                    <span className="text-zinc-200 dark:text-zinc-800">•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <Link to={`/blog/${blog._id}`} className="block group/title">
                        <h3 className="text-2xl font-bold leading-tight group-hover/title:text-brand-accent transition-colors duration-300">
                            {blog.title}
                        </h3>
                    </Link>
                    <Link 
                        to={`/user/${blog.userId?._id}`} 
                        onClick={handleAuthorClick}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity" 
                        title={user && blog.userId?._id === user._id ? "Edit your profile" : `View ${blog.userId?.name}'s profile`}
                    >
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary border border-brand-primary/20">
                            {blog.userId?.name?.[0]}
                        </div>
                    </Link>

                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                    {blog.excerpt || "Exploring the intersection of modern design philosophy and technical excellence."}
                </p>

                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-zinc-400 hover:text-brand-accent transition-colors">
                            <Heart size={16} />
                            <span className="text-[11px] font-bold">{blog.likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-zinc-400 hover:text-brand-accent transition-colors">
                            <MessageCircle size={16} />
                            <span className="text-[11px] font-bold">{blog.commentCount || 0}</span>
                        </button>
                    </div>

                    {actions && <div className="flex items-center space-x-3">{actions}</div>}
                    
                    {!actions && (
                        <Link 
                            to={`/blog/${blog._id}`} 
                            className="p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300"
                        >
                            <ArrowUpRight size={16} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
