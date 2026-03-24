```javascript
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogPosts';
import { Clock, ArrowRight } from 'lucide-react';
import BlogSubscribe from '../components/blog/BlogSubscribe';

const BlogIndex = () => {
    return (
        <div className="section-spacing">
            <div className="container" style={{ marginTop: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <h1 className="gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '1.5rem' }}>
                        Engineering Blog
                    </h1>
                    <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem' }}>
                        Insights into token economics, distributed systems, and the future of agentic orchestration.
                    </p>
                </motion.div>

                <div className="responsive-grid-large">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="glass-card" style={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                                    cursor: 'pointer'
                                }}>
                                    <div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ 
                                                fontFamily: 'var(--font-sans)', 
                                                fontSize: '0.75rem', 
                                                color: 'var(--accent-primary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em'
                                            }}>
                                                {post.category}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                <Clock size={14} />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                                            {post.title} <br />
                                            <em style={{ color: 'var(--accent-secondary)' }}>{post.subtitle}</em>
                                        </h2>
                                        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.deck}
                                        </p>
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.5rem', 
                                        color: 'var(--text-primary)', 
                                        fontWeight: 600,
                                        fontSize: '0.9rem'
                                    }}>
                                        Read Article <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;
