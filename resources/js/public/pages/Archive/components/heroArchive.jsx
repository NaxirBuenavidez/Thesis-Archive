import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Skeleton } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

const heroArchive = React.memo(({
    primaryColor,
    primaryDark,
    searchQuery,
    setSearchQuery,
    scrollToSection
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = '/images/hero-cover.png?v=2';
        img.onload = () => setImageLoaded(true);
    }, []);

    const HeroSkeleton = () => (
        <div style={{
            background: `linear-gradient(135deg, ${primaryDark} 0%, ${primaryColor} 100%)`,
            padding: 'padding: clamp(80px, 12vw, 140px) 5%',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
                <Skeleton active title={{ width: '60%', margin: '0 auto 24px' }} paragraph={{ rows: 2, width: ['80%', '60%'] }} />
                <div style={{ marginTop: 40, maxWidth: 600, margin: '40px auto 0' }}>
                    <Skeleton.Input active size="large" block style={{ height: 56, borderRadius: 12 }} />
                </div>
            </div>
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            {!imageLoaded ? (
                <motion.div
                    key="skeleton"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <HeroSkeleton />
                </motion.div>
            ) : (
                <motion.div
                    key="hero"
                    id="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        backgroundImage: `linear-gradient(rgba(13, 26, 112, 0.75), rgba(13, 26, 112, 0.75)), url(/images/hero-cover.png?v=2)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        padding: 'clamp(80px, 12vw, 140px) 5%',
                        textAlign: 'center',
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Animated Orbs */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="floating-orb" 
                        style={{ top: '-10%', right: '-5%', width: 450, height: 450, background: 'rgba(255,255,255,0.08)' }} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                        className="floating-orb" 
                        style={{ bottom: '-10%', left: '-5%', width: 350, height: 350, background: 'rgba(255,255,255,0.08)' }} 
                    />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        >
                            <Title style={{ color: '#fff', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 800, marginBottom: 24, letterSpacing: -1.5, textShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                                Discover Knowledge.
                            </Title>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        >
                            <Paragraph style={{ color: 'rgba(255,255,255,0.95)', fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', marginBottom: 'clamp(32px, 6vw, 60px)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 40px' }}>
                                Explore our comprehensive digital archive of research papers and dissertations, meticulously curated for the scholars and innovators of tomorrow.
                            </Paragraph>
                        </motion.div>

                        <motion.div 
                            className="hero-search-box" 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            style={{ maxWidth: 700, margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', borderRadius: 12, overflow: 'hidden' }}
                        >
                            <Input.Search
                                size="large"
                                placeholder="Search for research, authors, or topics..."
                                enterButton={<Button type="primary" style={{ background: '#222', borderColor: '#222', padding: '0 40px', height: '100%' }}>Search Archive</Button>}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onSearch={() => scrollToSection('search')}
                                style={{ height: 56 }}
                            />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 1 }}
                            style={{ marginTop: 40 }}
                        >
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 }}>
                                Advancing academic transparency through digital innovation.
                            </Text>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default heroArchive;
