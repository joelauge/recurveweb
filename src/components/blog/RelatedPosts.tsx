import React from 'react';
import { motion } from 'framer-motion';
import { blogPosts } from '../../data/blogPosts';

interface RelatedPostsProps {
    currentSlug: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentSlug }) => {
    // Filter out the current post and limit to 3 related posts
    const related = blogPosts
        .filter(post => post.slug !== currentSlug)
        .slice(0, 3);

    if (related.length === 0) return null;

    return (
        <section style={{ 
            marginTop: '8rem',
            paddingTop: '6rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            width: '100%'
        }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <h2 style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: '2.5rem', 
                    color: 'var(--text-primary)',
                    marginBottom: '4rem',
                    textAlign: 'center'
                }}>
                    Read Next
                </h2>
                
                <div className="responsive-grid-large" style={{ gap: '2rem' }}>
                    {related.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => window.location.href = `/blog/${post.slug}`}
                            className="glass-card"
                            style={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                padding: '2.5rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '1.5rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ marginBottom: 'auto' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <span style={{ 
                                        color: 'var(--accent-primary)', 
                                        fontSize: '0.8rem', 
                                        letterSpacing: '0.1em', 
                                        textTransform: 'uppercase',
                                        fontWeight: 600
                                    }}>
                                        {post.category}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.6 }}>
                                        {post.readTime}
                                    </span>
                                </div>
                                <h3 style={{ 
                                    fontFamily: 'var(--font-serif)', 
                                    fontSize: '1.75rem', 
                                    color: 'var(--text-primary)',
                                    marginBottom: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    {post.title}
                                </h3>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '1rem', 
                                    lineHeight: 1.6,
                                    opacity: 0.8,
                                    margin: 0
                                }}>
                                    {post.deck}
                                </p>
                            </div>
                            
                            <div style={{ 
                                marginTop: '2.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--accent-primary)',
                                fontWeight: 500,
                                fontSize: '0.9rem'
                            }}>
                                Read Article 
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '0.5rem' }}>
                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedPosts;
