import React from 'react';
import { Typography, Input, Button } from 'antd';

const { Title, Paragraph } = Typography;

const heroArchive = React.memo(({ 
    primaryColor, 
    primaryDark, 
    searchQuery, 
    setSearchQuery, 
    scrollToSection 
}) => {
    return (
        <div id="home" style={{ 
            background: `linear-gradient(135deg, ${primaryDark}ed 0%, ${primaryColor}e0 100%)`, 
            padding: 'clamp(60px, 10vw, 120px) 5%', 
            textAlign: 'center', 
            color: '#fff', 
            position: 'relative', 
            overflow: 'hidden' 
        }}>
            <div className="floating-orb" style={{ top: '-10%', right: '-5%', width: 450, height: 450, background: 'rgba(255,255,255,0.08)' }} />
            <div className="floating-orb" style={{ bottom: '-10%', left: '-5%', width: 350, height: 350, background: 'rgba(255,255,255,0.08)', animationDuration: '25s', animationDirection: 'alternate-reverse' }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
                <Title style={{ color: '#fff', fontSize: 'clamp(2rem, 6vw, 3.8rem)', fontWeight: 800, marginBottom: 24, letterSpacing: -1, textShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    Discover Knowledge.
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(1rem, 3vw, 1.25rem)', marginBottom: 'clamp(24px, 5vw, 48px)', lineHeight: 1.6 }}>
                    Explore our comprehensive digital archive of thesis papers, dissertations, and related studies perfectly curated for researchers and scholars.
                </Paragraph>

                <div className="hero-search-box" style={{ maxWidth: 650, margin: '0 auto', boxShadow: '0 12px 24px rgba(0,0,0,0.15)', borderRadius: 8 }}>
                    <Input.Search
                        size="large"
                        placeholder="Enter titles, keywords, authors..."
                        enterButton={<Button type="primary" style={{ background: '#222', borderColor: '#222', padding: '0 32px' }}>Search Archive</Button>}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onSearch={() => scrollToSection('search')}
                        style={{ borderRadius: 8 }}
                    />
                </div>
            </div>
        </div>
    );
});

export default heroArchive;
