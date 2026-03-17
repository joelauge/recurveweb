import { useState } from 'react';
import { FileText, Download, Youtube, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Materials = ({ onComplete }: { onComplete: () => void }) => {
  const [selectedVideo, setSelectedVideo] = useState<{title: string, embedId: string} | null>(null);

  const documents = [
    {
      name: "Pitch Deck",
      filename: "RecourseLLM_PreSeed_2026.pdf",
      path: "/RecourseLLM_PreSeed_2026.pdf",
      desc: "Overview of the market, product, and investment opportunity."
    },
    {
      name: "Executive One-Pager",
      filename: "ReCourseLLM_OnePager.pdf",
      path: "/ReCourseLLM_OnePager.pdf",
      desc: "A concise summary of our mission and core metrics."
    }
  ];

  const videos = [
    {
      title: "The Surgeon Analogy",
      embedId: "8b6nxz_9svU", // From https://youtube.com/shorts/8b6nxz_9svU
      desc: "A concept primer explaining the core philosophy of RecourseLLM."
    },
    {
      title: "Technical Architecture",
      embedId: "EP4hrC-p8Zw", // From https://youtu.be/EP4hrC-p8Zw
      desc: "Deep dive into the distributed telemetry and agent runtime orchestration."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FileText color="var(--accent-primary)" size={28} />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Investor Materials</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Documents Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--accent-primary)" />
            Documents
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {documents.map((doc, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{doc.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{doc.desc}</p>
                </div>
                <a 
                  href={doc.path} 
                  download={doc.filename}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '8px', 
                    background: 'rgba(214,160,75,0.1)', 
                    color: 'var(--accent-primary)',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(214,160,75,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(214,160,75,0.1)'}
                >
                  <Download size={20} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Youtube size={20} color="var(--accent-primary)" />
            Videos
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {videos.map((video, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{video.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>{video.desc}</p>
                <button 
                  onClick={() => setSelectedVideo({ title: video.title, embedId: video.embedId })}
                  className="btn-premium"
                  style={{ 
                    padding: '10px 16px', 
                    fontSize: '0.85rem', 
                    width: 'fit-content',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <Youtube size={16} />
                  Watch Video
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          onClick={onComplete}
          className="btn-premium"
          style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}
        >
          <span>Proceed to Sign SAFE</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Video Overlay Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '1000px',
                aspectRatio: '16/9',
                background: '#0a0a0a',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 10
              }}>
                <button
                  onClick={() => setSelectedVideo(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <X size={20} />
                </button>
              </div>

              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Materials;
