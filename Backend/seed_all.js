const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require(path.join(__dirname, 'Model', 'user'));
const Blog = require(path.join(__dirname, 'Model', 'blog'));
const Category = require(path.join(__dirname, 'Model', 'category'));
const Comment = require(path.join(__dirname, 'Model', 'comment'));

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Connected to DB for full seeding...");

        // Clean all collections
        await User.deleteMany({});
        await Blog.deleteMany({});
        await Category.deleteMany({});
        await Comment.deleteMany({});
        console.log("Cleared existing data.");

        // 1. Seed Categories
        const categories = [
            { name: 'Design', count: 12 },
            { name: 'Tech', count: 45 },
            { name: 'Startup', count: 28 },
            { name: 'AI', count: 32 },
            { name: 'Coding', count: 56 },
            { name: 'Lifestyle', count: 15 }
        ];
        await Category.insertMany(categories);
        console.log("Seeded categories.");

        // 2. Seed Users
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash('admin123', salt);
        const hashedAuthorPassword = await bcrypt.hash('author123', salt);

        const users = await User.insertMany([
            {
                name: 'System Admin',
                email: 'admin@lumina.com',
                password: hashedAdminPassword,
                isAdmin: true,
                bio: 'Managing the digital sanctuary of storytelling.',
                profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'
            },
            {
                name: 'Jane Smith',
                email: 'jane@lumina.com',
                password: hashedAuthorPassword,
                isAdmin: false,
                bio: 'Passionate about minimalist design and editorial photography.',
                profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop'
            },
            {
                name: 'Mark Miller',
                email: 'mark@lumina.com',
                password: hashedAuthorPassword,
                isAdmin: false,
                bio: 'Full-stack developer sharing insights on MERN architecture.',
                profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop'
            }
        ]);
        console.log("Seeded users.");

        const adminId = users[0]._id;
        const janeId = users[1]._id;
        const markId = users[2]._id;

        // 3. Seed Blogs
        const blogsData = [
            {
                title: "The Art of Minimalist Digital Storytelling",
                content: "In a world of constant digital noise, minimalism isn't just a design choice—it's a narrative strategy. By stripping away the unnecessary, we allow the core message to breathe and resonate with the audience on a deeper level. This approach involves focusing on high-quality metaphors, intentional whitespace, and a cohesive visual language that guides the reader through the journey without distractions.",
                excerpt: "Exploring the intersection of modern design philosophy and technical excellence.",
                image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
                category: "Design",
                userId: janeId,
                status: "Published",
                tags: ["minimalism", "design", "storytelling"]
            },
            {
                title: "Architecting Scalable MERN Applications",
                content: "Scaling a MERN application requires more than just adding resources. It involves a fundamental understanding of how MongoDB, Express, React, and Node.js interact at high loads. From implementing efficient database indexing to optimizing React renders and leveraging Node's non-blocking I/O—every layer needs a strategic engineering approach. In this guide, we dive deep into the patterns that make modern web apps truly resilient.",
                excerpt: "Deep dive into the patterns that make modern web apps truly resilient.",
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
                category: "Tech",
                userId: markId,
                status: "Published",
                tags: ["MERN", "Scalability", "Architecture"]
            },
            {
                title: "The Future of Generative AI in Creative Writing",
                content: "Generative AI is transforming the landscape of creative writing. While some see it as a threat, many writers are embracing it as a powerful collaborator. AI tools can assist in brainstorming, refining prose, and even suggesting narrative structures. However, the human touch—emotion, nuance, and lived experience—remains the essential ingredient that turns a generated text into a compelling story.",
                excerpt: "How AI is becoming a collaborator rather than a competitor for creative minds.",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
                category: "AI",
                userId: adminId,
                status: "Published",
                tags: ["AI", "Future", "Writing"]
            },
            {
                title: "Building a Design System from Scratch",
                content: "Design systems are the backbone of consistent user experiences. Starting one from scratch requires a balance of atoms, molecules, and organisms—following the atomic design methodology. We will explore how to define a color palette, typography scales, and a robust component library that empowers both designers and developers to build faster and with higher fidelity.",
                excerpt: "A step-by-step guide to creating a cohesive visual language for your products.",
                image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop",
                category: "Design",
                userId: janeId,
                status: "Published",
                tags: ["Design System", "UI/UX", "Workflow"]
            },
            {
                title: "10 Startup Lessons from the Trenches",
                content: "Launching a startup is a series of highs and lows. After five years of building Lumina, I've learned that product-market fit is the only metric that truly matters in the beginning. In this post, I share the hard lessons on hiring, pivoting, and maintaining a clear vision when everything seems to be going wrong at once. We explore the emotional resilience required to lead a team through uncertainty and how to turn failures into strategic advantages.",
                excerpt: "Hard-earned insights on hiring, pivoting, and maintaining vision.",
                image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2024&auto=format&fit=crop",
                category: "Startup",
                userId: adminId,
                status: "Published",
                tags: ["Startup", "Entrepreneurship", "Lessons"]
            },
            {
                title: "Mastering TypeScript: Beyond the Basics",
                content: "TypeScript has become the industry standard for scalable JavaScript applications. But are you using it to its full potential? In this article, we explore advanced patterns like mapped types, conditional types, and utility types that can make your codebase significantly more robust. We also discuss how to effectively integrate TS into existing MERN projects without overwhelming your development team.",
                excerpt: "Level up your development workflow with advanced TypeScript patterns and utility types.",
                image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
                category: "Coding",
                userId: markId,
                status: "Published",
                tags: ["TypeScript", "Coding", "WebDev"]
            },
            {
                title: "The Clean Code Manifesto for Modern Teams",
                content: "Writing code that works is easy; writing code that lasts is an art. We revisit the principles of Clean Code—meaningful names, small functions, and DRY principles—updated for the era of functional React components and asynchronous Node.js. Learn how to conduct better code reviews and build a culture of technical excellence within your engineering organization.",
                excerpt: "Why readability is the most important feature of your professional codebase.",
                image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
                category: "Coding",
                userId: markId,
                status: "Published",
                tags: ["Clean Code", "Engineering", "Best Practices"]
            },
            {
                title: "Curating a Minimalist Workspace for Focus",
                content: "Environment plays a crucial role in our productivity and mental well-being. A minimalist workspace isn't just about aesthetics; it's about removing cognitive load. From choosing the right ergonomic lighting to cable management and the 'one-item-on-desk' rule—discover how to design a physical environment that supports deep work and creative flow.",
                excerpt: "How to design a physical environment that supports deep work and creative flow.",
                image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
                category: "Lifestyle",
                userId: janeId,
                status: "Published",
                tags: ["Mindfulness", "Productivity", "Workspace"]
            },
            {
                title: "Slow Living in a High-Speed Digital Age",
                content: "The pressure to be constantly 'on' is leading to unprecedented levels of burnout. Slow living is an intentional movement that prioritizes quality over quantity and presence over performance. We discuss practical ways to disconnect, the benefits of digital detoxes, and how to reclaim your time for the things that truly bring you joy without sacrificing professional ambition.",
                excerpt: "Reclaiming your time and mental clarity through intentional living.",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2024&auto=format&fit=crop",
                category: "Lifestyle",
                userId: janeId,
                status: "Published",
                tags: ["Wellness", "Slow Living", "Balance"]
            }
        ];

        const blogs = await Blog.insertMany(blogsData);
        console.log("Seeded blogs.");

        // 4. Seed Comments
        const commentsData = [
            {
                text: "This is exactly what I needed to read today. Minimalism really is a game changer!",
                user: markId,
                blog: blogs[0]._id,
                replies: [
                    { text: "Glad it resonated with you, Mark!", user: janeId }
                ]
            },
            {
                text: "Great insights on scalability. Would love to see more on MongoDB indexing strategies.",
                user: adminId,
                blog: blogs[1]._id
            }
        ];
        await Comment.insertMany(commentsData);
        console.log("Seeded comments.");

        console.log("Full database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
