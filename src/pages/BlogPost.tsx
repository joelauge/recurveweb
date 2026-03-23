import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogPosts';
import StatRow from '../components/blog/StatRow';
import TokenDiagram from '../components/blog/TokenDiagram';
import PrincipleGrid from '../components/blog/PrincipleGrid';
import { ArrowLeft, Clock } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="section-spacing">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1>Post Not Found</h1>
                    <Link to="/blog" className="btn-premium" style={{ marginTop: '2rem' }}>Back to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '8rem' }}>
            {/* Gold rule at the top */}
            <div style={{ 
                height: '2px', 
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                position: 'relative',
                zIndex: 10
            }} />

            <div className="container" style={{ maxWidth: '800px', padding: '6rem 2rem 2rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/blog" style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        color: 'var(--accent-primary)', 
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        marginBottom: '3rem'
                    }}>
                        <ArrowLeft size={16} /> Back to engineering blog
                    </Link>
                </motion.div>

                <article>
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p style={{ 
                            fontFamily: 'var(--font-sans)', 
                            fontSize: '0.8rem', 
                            letterSpacing: '0.2em', 
                            color: 'var(--accent-primary)',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                            opacity: 0.8
                        }}>
                            {post.category}
                        </p>
                        <h1 style={{ 
                            fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)'
                        }}>
                            {post.title}<br />
                            <em style={{ color: 'var(--accent-secondary)' }}>{post.subtitle}</em>
                        </h1>
                        <p style={{ 
                            fontSize: '1.25rem', 
                            lineHeight: 1.6, 
                            color: 'var(--text-primary)',
                            marginBottom: '2.5rem',
                            opacity: 0.9
                        }}>
                            {post.deck}
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1.5rem',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '1.5rem'
                        }}>
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Clock size={14} /> {post.readTime}
                            </span>
                        </div>
                    </motion.header>

                    <div style={{ marginTop: '4rem' }}>
                        {post.content.map((block, idx) => {
                            switch (block.type) {
                                case 'paragraph':
                                    return (
                                        <p key={idx} style={{ 
                                            fontSize: '1.15rem', 
                                            lineHeight: 1.8, 
                                            color: 'var(--text-secondary)',
                                            marginBottom: '2rem',
                                            fontWeight: block.isStrong ? 600 : 400
                                        }}>
                                            {block.text.split('**').map((part: string, i: number) => 
                                                i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text-primary)' }}>{part}</strong> : part
                                            )}
                                        </p>
                                    );
                                case 'heading':
                                    const CustomTag = `h${block.level}` as any;
                                    return (
                                        <CustomTag key={idx} style={{ 
                                            fontSize: block.level === 2 ? '2rem' : '1.25rem',
                                            margin: block.level === 2 ? '4rem 0 1.5rem' : '3rem 0 1rem',
                                            color: 'var(--text-primary)',
                                            fontFamily: block.level === 3 ? 'var(--font-sans)' : 'var(--font-serif)',
                                            letterSpacing: block.level === 3 ? '0.1em' : 'normal',
                                            textTransform: block.level === 3 ? 'uppercase' : 'none'
                                        }}>
                                            {block.text}
                                        </CustomTag>
                                    );
                                case 'pullQuote':
                                    return (
                                        <div key={idx} style={{ 
                                            borderLeft: '2px solid var(--accent-primary)',
                                            padding: '1.5rem 0 1.5rem 2.5rem',
                                            margin: '4rem 0'
                                        }}>
                                            <p style={{ 
                                                fontFamily: 'var(--font-serif)', 
                                                fontSize: '1.5rem', 
                                                fontStyle: 'italic',
                                                color: 'var(--text-primary)',
                                                lineHeight: 1.5,
                                                margin: 0
                                            }}>
                                                "{block.text}"
                                            </p>
                                        </div>
                                    );
                                case 'statRow':
                                    return <StatRow key={idx} stats={block.stats} />;
                                case 'tokenDiagram':
                                    return <TokenDiagram key={idx} label={block.label} items={block.items} />;
                                case 'principleGrid':
                                    return <PrincipleGrid key={idx} principles={block.principles} />;
                                case 'cta':
                                    return (
                                        <div key={idx} className="glass-card" style={{ 
                                            textAlign: 'center', 
                                            padding: '3rem', 
                                            margin: '5rem 0',
                                            background: 'rgba(214, 160, 75, 0.05)',
                                            borderColor: 'rgba(214, 160, 75, 0.2)'
                                        }}>
                                            <p style={{ 
                                                fontFamily: 'var(--font-serif)', 
                                                fontSize: '1.5rem', 
                                                fontStyle: 'italic',
                                                color: 'var(--text-primary)',
                                                marginBottom: '1.5rem'
                                            }}>
                                                {block.text}
                                            </p>
                                            <a href={block.link} className="btn-premium">
                                                {block.linkText}
                                            </a>
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
