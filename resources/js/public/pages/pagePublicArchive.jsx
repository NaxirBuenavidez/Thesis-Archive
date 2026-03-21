import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Typography, Input, Button, Card, Tag, Space, Modal, Divider, Row, Col, Collapse, theme, Drawer, Pagination, Spin, Empty } from 'antd';
import { SearchOutlined, BookOutlined, FileTextOutlined, GlobalOutlined, InfoCircleOutlined, QuestionCircleOutlined, BankOutlined, FileProtectOutlined, LockOutlined, PhoneOutlined, MailOutlined, HomeOutlined, UserOutlined, CalendarOutlined, TagOutlined, MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSystemConfig } from '../../context/SystemConfigContext';
import dayjs from 'dayjs';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function PublicArchive() {
    const { token } = theme.useToken();
    const { primary_color, primary_color_dark, site_title, site_description, logo_path } = useSystemConfig();

    const primaryColor = primary_color || '#2845D6';
    const primaryDark = primary_color_dark || '#1A2CA3';
    const appName = site_title || 'Digital Thesis Archive';
    
    // Convert hex to url-encoded for SVG
    const svgHex = primaryColor.replace('#', '%23');
    // Dynamic mixed education icons background pattern
    const abstractBgPattern = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${svgHex}' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M12 3L1 9L4 10.63V17L12 21L20 17V10.63L21 10.09V17H23V9L12 3ZM12 5.18L19.31 9.14L12 13.1L4.69 9.14L12 5.18ZM6 12.38L12 15.64L18 12.38V15.74L12 18.99L6 15.74V12.38Z' transform='translate(15, 15) scale(1.6)'/%3E%3Cpath d='M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.84 1.18 21 1.39 21C1.43 21 1.48 21 1.52 20.98C2.86 20.35 4.88 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.3 20.65 15.82 20 17.5 20C19.16 20 20.97 20.3 22.42 21C22.61 21.1 22.84 21.05 22.95 20.86C22.98 20.8 23 20.73 23 20.65V6C22.4 5.6 21.73 5.27 21 5ZM21 18.5C19.9 18.15 18.73 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.73 6.5 19.9 6.65 21 7V18.5Z' transform='translate(65, 65) scale(1.3)'/%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' transform='translate(75, 15)'/%3E%3Cpath d='M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z' transform='translate(15, 75)'/%3E%3C/g%3E%3C/svg%3E")`;
    
    // The white reveal icon layer
    const svgHexWhite = '%23FFFFFF';
    const abstractBgPatternWhite = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${svgHexWhite}' fill-opacity='0.9' fill-rule='evenodd'%3E%3Cpath d='M12 3L1 9L4 10.63V17L12 21L20 17V10.63L21 10.09V17H23V9L12 3ZM12 5.18L19.31 9.14L12 13.1L4.69 9.14L12 5.18ZM6 12.38L12 15.64L18 12.38V15.74L12 18.99L6 15.74V12.38Z' transform='translate(15, 15) scale(1.6)'/%3E%3Cpath d='M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.84 1.18 21 1.39 21C1.43 21 1.48 21 1.52 20.98C2.86 20.35 4.88 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.3 20.65 15.82 20 17.5 20C19.16 20 20.97 20.3 22.42 21C22.61 21.1 22.84 21.05 22.95 20.86C22.98 20.8 23 20.73 23 20.65V6C22.4 5.6 21.73 5.27 21 5ZM21 18.5C19.9 18.15 18.73 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.73 6.5 19.9 6.65 21 7V18.5Z' transform='translate(65, 65) scale(1.3)'/%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' transform='translate(75, 15)'/%3E%3Cpath d='M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z' transform='translate(15, 75)'/%3E%3C/g%3E%3C/svg%3E")`;

    // State
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewThesis, setViewThesis] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    // Mobile Menu State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fetch public data
    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const response = await axios.get('/api/public/theses');
                if (Array.isArray(response.data)) {
                    setTheses(response.data);
                } else if (response.data && Array.isArray(response.data.data)) {
                    setTheses(response.data.data);
                } else {
                    console.error("API returned non-array data:", response.data);
                    setTheses([]);
                }
            } catch (error) {
                console.error("Failed to load public repository", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicData();
    }, []);

    // Derived Data
    const categories = useMemo(() => {
        const cats = new Set(theses.map(t => t.department || 'General'));
        return ['All', ...Array.from(cats)].sort();
    }, [theses]);

    // Filtering
    const filteredTheses = useMemo(() => {
        setCurrentPage(1); // Reset page on filter/category changes
        return theses.filter(t => {
            const matchesSearch = (t.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                                  (t.author?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                  (t.keywords || []).some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || t.department === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [theses, searchQuery, selectedCategory]);

    // Render Helpers
    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { label: 'Home', id: 'home', icon: <GlobalOutlined /> },
        { label: 'Search', id: 'search', icon: <SearchOutlined /> },
        { label: 'Research Categories', id: 'categories', icon: <BookOutlined /> },
        { label: 'Manual & Guides', id: 'guides', icon: <InfoCircleOutlined /> },
        { label: 'FAQ', id: 'faq', icon: <QuestionCircleOutlined /> },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(rgba(240, 242, 245, 0.94), rgba(240, 242, 245, 0.94)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop") center/cover fixed', position: 'relative' }}>
            <style>{`
                .hero-search-box {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    border-radius: 8px;
                }
                .hero-search-box:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
                }
                .public-thesis-card {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .public-thesis-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 16px 36px rgba(0,0,0,0.08) !important;
                    border-color: ${primaryColor} !important;
                }
                .floating-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(40px);
                    animation: floatOrb 20s infinite ease-in-out alternate;
                    pointer-events: none;
                }
                @keyframes floatOrb {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-30px, 40px) scale(1.1); }
                }
                .dspace-title-hover:hover {
                    color: ${primaryDark} !important;
                    text-decoration: underline;
                }
                .desktop-nav { display: flex; }
                .mobile-nav-btn { display: none !important; }
                @media (max-width: 800px) {
                    .desktop-nav { display: none !important; }
                    .mobile-nav-btn { display: flex !important; }
                }
            `}</style>
            
            {/* ── MIXED EDUCATION ICONS TILE BACKGROUND ── */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                backgroundImage: abstractBgPattern
            }} />

            {/* ── HEADER ── */}
            <Header style={{ 
                position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 5%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
                    {logo_path ? (
                        <img src={logo_path} alt="Logo" style={{ height: 40 }} />
                    ) : (
                        <div style={{ width: 40, height: 40, background: primaryColor, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                            {site_title ? site_title.substring(0, 2).toUpperCase() : 'DA'}
                        </div>
                    )}
                    <Title level={4} style={{ margin: 0, color: primaryDark, letterSpacing: 0.5 }}>{appName}</Title>
                </div>
                
                {/* Desktop Nav */}
                <Space size="large" className="public-nav desktop-nav">
                    {navItems.map(item => (
                        <div key={item.id} 
                            onClick={() => scrollToSection(item.id)}
                            style={{ 
                                cursor: 'pointer', 
                                fontWeight: activeSection === item.id ? 600 : 400,
                                color: activeSection === item.id ? primaryColor : '#555',
                                transition: 'all 0.2s',
                                borderBottom: activeSection === item.id ? `2px solid ${primaryColor}` : '2px solid transparent',
                                padding: '20px 0'
                            }}>
                            {item.icon} <span style={{ marginLeft: 6 }}>{item.label}</span>
                        </div>
                    ))}
                    <Link to="/login">
                        <Button type="primary" style={{ background: primaryColor, borderRadius: 6, fontWeight: 500 }}>
                            Admin / Client Portal
                        </Button>
                    </Link>
                </Space>
                
                {/* Mobile Nav Button */}
                <Button 
                    type="text" 
                    icon={<MenuOutlined style={{ fontSize: 24, color: primaryDark }} />} 
                    className="mobile-nav-btn"
                    onClick={() => setMobileMenuOpen(true)}
                    style={{ background: 'transparent', border: 'none', padding: 0, height: 'auto', display: 'flex', alignItems: 'center' }}
                />
            </Header>

            {/* ── MOBILE NAV DRAWER ── */}
            <Drawer
                title={<div style={{ color: primaryDark, fontWeight: 700, fontSize: 18 }}>{appName}</div>}
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {navItems.map(item => (
                        <div key={item.id} 
                            onClick={() => {
                                setMobileMenuOpen(false);
                                scrollToSection(item.id);
                            }}
                            style={{ 
                                padding: '16px 24px',
                                fontSize: 16,
                                borderBottom: '1px solid #f0f0f0',
                                color: activeSection === item.id ? primaryColor : '#475569',
                                background: activeSection === item.id ? `${primaryColor}10` : 'transparent',
                                fontWeight: activeSection === item.id ? 600 : 500,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center'
                            }}>
                            <span style={{ fontSize: 18 }}>{item.icon}</span> <span style={{ marginLeft: 16 }}>{item.label}</span>
                        </div>
                    ))}
                    <div style={{ padding: '24px' }}>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button type="primary" block size="large" style={{ background: primaryColor, borderRadius: 6, fontWeight: 500 }}>
                                Admin / Client Portal
                            </Button>
                        </Link>
                    </div>
                </div>
            </Drawer>

            <Content>
                {/* ── HERO / HOME ── */}
                <div id="home" style={{ 
                    background: `linear-gradient(135deg, ${primaryDark}ed 0%, ${primaryColor}e0 100%)`, 
                    padding: 'clamp(60px, 10vw, 120px) 5%', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden'
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
                                onChange={(e) => { setSearchQuery(e.target.value); setActiveSection('search'); }}
                                onSearch={() => scrollToSection('search')}
                                style={{ borderRadius: 8 }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── SEARCH & CATEGORIES ── */}
                <div id="search" style={{ padding: 'clamp(40px, 6vw, 60px) 5%', maxWidth: 1400, margin: '0 auto' }}>
                    <div id="categories" style={{ marginBottom: 40 }}>
                        <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <BookOutlined style={{ color: primaryColor }} /> Research Categories
                        </Title>
                        <Space wrap size={[12, 16]}>
                            {categories.map(cat => (
                                <Tag.CheckableTag
                                    key={cat}
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                    style={{ 
                                        padding: '6px 16px', fontSize: 14, borderRadius: 20,
                                        border: `1px solid ${selectedCategory === cat ? primaryColor : '#d9d9d9'}`,
                                        background: selectedCategory === cat ? primaryColor : '#fff',
                                    }}
                                >
                                    {cat}
                                </Tag.CheckableTag>
                            ))}
                        </Space>
                    </div>

                    <Divider />

                    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">Showing {filteredTheses.length} published studies</Text>
                        {searchQuery && (
                            <Tag closable onClose={() => setSearchQuery('')} color="blue">
                                Search: {searchQuery}
                            </Tag>
                        )}
                    </div>

                    {selectedCategory === 'All' ? (
                        <Spin spinning={loading}>
                            {filteredTheses.length === 0 && !loading ? (
                                <Empty description="No public records match your search criteria." style={{ margin: '60px 0' }} />
                            ) : (
                                <>
                                    <Row gutter={[24, 24]}>
                                        {filteredTheses.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(item => (
                                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={item.id}>
                                                <Card 
                                        hoverable
                                        className="public-thesis-card"
                                        onClick={() => setViewThesis(item)}
                                        style={{ height: '100%', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}
                                        styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%' } }}
                                        cover={
                                            <div style={{ height: 140, background: '#edf1f5', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                                                {/* Fake blurred document representation tease */}
                                                <div style={{ width: '60%', height: 'calc(100% - 20px)', background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,0.1)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, filter: 'blur(3.5px)', opacity: 0.8, transform: 'translateY(20px)', borderRadius: '4px 4px 0 0' }}>
                                                    <div style={{ height: 8, background: primaryDark, width: '40%', margin: '0 auto 12px auto', opacity: 0.3 }} />
                                                    <div style={{ height: 4, background: '#cbd5e1', width: '100%' }} />
                                                    <div style={{ height: 4, background: '#cbd5e1', width: '100%' }} />
                                                    <div style={{ height: 4, background: '#cbd5e1', width: '90%' }} />
                                                    <div style={{ height: 4, background: '#cbd5e1', width: '95%' }} />
                                                    <div style={{ height: 4, background: '#cbd5e1', width: '60%' }} />
                                                </div>
                                                {/* Mask to blend the bottom */}
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(248,249,250,0) 0%, rgba(248,249,250,1) 100%)', pointerEvents: 'none' }} />
                                                
                                                {/* Call To Action Prompt Label */}
                                                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                                    <LockOutlined /> SHIELDED MANUSCRIPT
                                                </div>
                                            </div>
                                        }
                                    >
                                        <Tag color={primaryColor} style={{ alignSelf: 'flex-start', marginBottom: 12, borderRadius: 4 }}>
                                            {item.department || 'General'}
                                        </Tag>
                                        <Title level={5} style={{ marginTop: 0, marginBottom: 8, lineHeight: 1.4, color: primaryDark }}>
                                            {item.title}
                                        </Title>
                                        <Text type="secondary" style={{ marginBottom: 4, display: 'block' }}>
                                            By <Text strong>{item.author}</Text>
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                                            Published {dayjs(item.submission_date || item.created_at).format('YYYY')}
                                        </Text>
                                        
                                        {/* Clarified DOI Metadata Priority */}
                                        {item.doi ? (
                                            <Text style={{ display: 'inline-block', fontSize: 12, background: 'rgba(40,69,214,0.06)', color: primaryColor, padding: '4px 10px', borderRadius: 4, marginBottom: 16, fontWeight: 700 }}>
                                                DOI: {item.doi}
                                            </Text>
                                        ) : (
                                            <div style={{ marginBottom: 4 }} />
                                        )}

                                        <Paragraph ellipsis={{ rows: 3 }} type="secondary" style={{ flex: 1, marginBottom: 0, fontSize: 13, lineHeight: 1.6 }}>
                                            {item.abstract || 'No abstract openly available for this study.'}
                                        </Paragraph>
                                        
                                        <div style={{ marginTop: 16 }}>
                                            {(item.keywords || []).slice(0, 3).map(k => (
                                                <Tag key={k} style={{ border: 0, background: '#f5f5f5', color: '#666', fontSize: 12 }}>{k}</Tag>
                                            ))}
                                        </div>
                                    </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                                        <Pagination
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={filteredTheses.length}
                                            onChange={(page) => setCurrentPage(page)}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                </>
                            )}
                        </Spin>
                    ) : (
                        <div style={{ maxWidth: 1050, margin: '0 auto', background: '#fff', padding: '48px 64px', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                            <div style={{ marginBottom: 32 }}>
                                <Text style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>Home &gt; <span style={{ color: primaryColor, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setSelectedCategory('All')}>Theses and Dissertations</span> &gt; <Text type="secondary">{selectedCategory}</Text></Text>
                            </div>
                            
                            <div style={{ borderBottom: `3px solid #f59e0b`, display: 'inline-block', paddingBottom: 12, marginBottom: 24 }}>
                                <Title level={2} style={{ color: '#475569', textTransform: 'uppercase', margin: 0, letterSpacing: -0.5 }}>
                                    {selectedCategory}
                                </Title>
                            </div>
                            
                            <Text style={{ display: 'block', marginBottom: 48, fontSize: 15, color: '#64748b', fontWeight: 500 }}>
                                Theses and dissertations submitted to {selectedCategory}
                            </Text>
                            
                            <Title level={4} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 16, color: '#64748b', marginBottom: 32, fontWeight: 500 }}>
                                Items in this Collection
                            </Title>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                                {filteredTheses.map(item => (
                                    <div key={item.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: 32 }}>
                                        <Text style={{ fontSize: 18, color: '#2563eb', cursor: 'pointer', fontWeight: 600, display: 'block', marginBottom: 12, transition: 'color 0.2s', lineHeight: 1.4 }} onClick={() => setViewThesis(item)} className="dspace-title-hover">
                                            {item.title}
                                        </Text>
                                        
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', color: '#64748b', fontSize: 13, marginBottom: 20 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><UserOutlined style={{ marginRight: 6 }}/> By <Text strong style={{ color: '#475569', marginLeft: 4 }}>{item.author}</Text></span>
                                            <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><CalendarOutlined style={{ marginRight: 6 }}/> {dayjs(item.submission_date || item.created_at).format('DD MMMM YYYY')}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><BookOutlined style={{ marginRight: 6 }}/> Thesis/Dissertation</span>
                                        </div>
                                        
                                        <div style={{ paddingLeft: 20, borderLeft: '4px solid #e2e8f0', color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>
                                            {item.abstract ? (item.abstract.length > 400 ? item.abstract.substring(0, 400) + '...' : item.abstract) : 'No abstract overtly provided ...'}
                                        </div>
                                        
                                        {(item.keywords && item.keywords.length > 0) && (
                                            <div>
                                               <TagOutlined style={{ marginRight: 8, color: '#94a3b8' }}/> 
                                               <Text style={{ fontSize: 13, color: '#475569' }}>
                                                   {item.keywords.join('; ')}
                                               </Text>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {filteredTheses.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                                        <i>No records dynamically matched within this specific program boundary.</i>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Divider style={{ margin: 0 }} />

                {/* ── MANUAL & GUIDES ── */}
                <div id="guides" style={{ background: 'rgba(255,255,255,0.85)', padding: 'clamp(40px, 8vw, 80px) 5%' }}>
                    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}><InfoCircleOutlined style={{ color: primaryColor, marginRight: 12 }}/>Manuals & Guides</Title>
                        <Row gutter={[32, 32]}>
                            <Col xs={24} md={12}>
                                <Card variant="borderless" style={{ background: '#fafafa', borderRadius: 12 }}>
                                    <Title level={4}><BankOutlined style={{ color: primaryColor }} /> Submission Guide</Title>
                                    <Paragraph type="secondary">
                                        Students must proceed to the internal Client Portal to submit their thesis parameters. Only properly formatted PDF documents are permanently archived within the system backend. A meticulous review from administrators dictates visibility.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card variant="borderless" style={{ background: '#fafafa', borderRadius: 12 }}>
                                    <Title level={4}><FileTextOutlined style={{ color: primaryColor }} /> Advanced Search Manual</Title>
                                    <Paragraph type="secondary">
                                        Utilize the dynamic search bar to quickly scan across Titles, Keywords, and Author Names mapping back instantly to our secured relational database. You can instantly refine your results by toggling Research Categories.
                                    </Paragraph>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* ── FAQ ── */}
                <div id="faq" style={{ padding: 'clamp(40px, 8vw, 80px) 5%', maxWidth: 800, margin: '0 auto' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}><QuestionCircleOutlined style={{ color: primaryColor, marginRight: 12 }}/>Frequently Asked Questions</Title>
                    <Collapse ghost expandIconPlacement="end" items={[
                        { key: '1', label: <Text strong style={{ fontSize: 16 }}>Can I download the full document from this public portal?</Text>, children: <Paragraph type="secondary">No. This digital archive only exposes metadata (Abstract, Authors, Information) to the public domain. To securely retrieve or download any manuscript, you must be granted strict institutional portal access as an authorized Client or Admin.</Paragraph> },
                        { key: '2', label: <Text strong style={{ fontSize: 16 }}>How frequently is this repository updated?</Text>, children: <Paragraph type="secondary">The repository dynamically syncs in absolute real-time. The very moment a thesis is fully marked as 'Published' structurally by an authorized reviewer, it propagates instantly to this index.</Paragraph> },
                        { key: '3', label: <Text strong style={{ fontSize: 16 }}>Who determines if a study is classified as Confidential?</Text>, children: <Paragraph type="secondary">Parameters including Confidentiality locks are determined strictly behind closed walls within the digital review panels inside the institution's private internal network.</Paragraph> }
                    ]} />
                </div>
            </Content>

            {/* ── E-GOV.PH Footer & PECIT ── */}
            <Footer style={{ background: '#efefef', color: '#333', padding: '60px 5% 40px', borderTop: `4px solid ${primaryDark}`, position: 'relative', zIndex: 1 }}>
                <Row gutter={[48, 32]}>
                    <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                        {/* Institutional Logo configured to mirror the standard egov layout seal */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <a href="https://pecit.edu.ph/" target="_blank" rel="noopener noreferrer">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        {logo_path ? (
                                            <img src={logo_path} alt="PECIT Logo" style={{ height: 120, objectFit: 'contain' }} />
                                        ) : (
                                            <div style={{ width: 100, height: 100, background: primaryColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 40 }}>P</div>
                                        )}
                                        <Text strong style={{ color: primaryDark, fontSize: 16, lineHeight: 1.2 }}>PECIT</Text>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Col>
                    
                    <Col xs={24} md={6}>
                        <Title level={5} style={{ color: '#333', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>PHILIPPINE ELECTRONICS AND COMMUNICATION INSTITUTE OF TECHNOLOGY</Title>
                        <Paragraph style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>
                            All content is in the public domain unless otherwise stated. This digital archive exclusively serves the thesis research output of our brilliant students and faculty.
                        </Paragraph>
                        <Title level={5} style={{ color: '#333', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 24, marginBottom: 16 }}>Terms & Privacy</Title>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <li><a href="#" style={{ color: '#555', textDecoration: 'none' }}>Terms of Use and Conditions</a></li>
                            <li><a href="#" style={{ color: '#555', textDecoration: 'none' }}>Data Privacy Policy</a></li>
                        </ul>
                    </Col>
                    
                    <Col xs={24} md={6}>
                        <Title level={5} style={{ color: '#333', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>CONTACT US</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                            <div>
                                <Text style={{ color: '#555', display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                    <HomeOutlined style={{ marginTop: 3 }} /> Address
                                </Text>
                                <Paragraph style={{ color: '#666', fontSize: 13, margin: 0, paddingLeft: 22, lineHeight: 1.5 }}>
                                    Capitol-Bonbon Road, Imadejas Subd.<br/>
                                    Butuan City, Philippines 8600
                                </Paragraph>
                            </div>
                            <div>
                                <Text style={{ color: '#555', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                    <MailOutlined /> Emails
                                </Text>
                                <Paragraph style={{ color: '#666', fontSize: 13, margin: 0, paddingLeft: 22, lineHeight: 1.5 }}>
                                    pecit83@gmail.com<br/>
                                    pecit.education83@gmail.com
                                </Paragraph>
                            </div>
                        </div>
                    </Col>
                    
                    <Col xs={24} md={6}>
                        <Title level={5} style={{ color: '#333', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>FOR INQUIRIES</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                            <div>
                                <Text style={{ color: primaryDark, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                    <PhoneOutlined /> COLLEGE
                                </Text>
                                <Paragraph style={{ color: '#666', fontSize: 13, margin: 0, paddingLeft: 22 }}>
                                    (+63) 92704-95730 or<br/>
                                    (+63) 95138-70989
                                </Paragraph>
                            </div>
                            <div>
                                <Text style={{ color: primaryDark, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                    <PhoneOutlined /> TESDA
                                </Text>
                                <Paragraph style={{ color: '#666', fontSize: 13, margin: 0, paddingLeft: 22 }}>
                                    (+63) 96391-58460 or<br/>
                                    (+63) 92704-95730
                                </Paragraph>
                            </div>
                            <div>
                                <Text style={{ color: primaryDark, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                    <PhoneOutlined /> BASIC EDUCATION
                                </Text>
                                <Paragraph style={{ color: '#666', fontSize: 13, margin: 0, paddingLeft: 22 }}>
                                    (+63) 93868-50231
                                </Paragraph>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Footer>

            {/* ── METADATA MODAL ── */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            <FileProtectOutlined style={{ color: '#475569', fontSize: 24 }} />
                        </div>
                        <span style={{ color: '#1e293b', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 800 }}>Record Metadata Overview</span>
                    </div>
                }
                open={!!viewThesis}
                onCancel={() => setViewThesis(null)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setViewThesis(null)} style={{ background: '#334155', borderRadius: 6 }}>Close Record</Button>
                ]}
                width={800}
                centered
            >
                {viewThesis && (
                    <div style={{ paddingTop: 16 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            <Tag color="blue">{viewThesis.department || 'Category Unspecified'}</Tag>
                            {viewThesis.degree_type && <Tag color="cyan">{viewThesis.degree_type}</Tag>}
                            <Tag color="green">Published Study ID: {viewThesis.id}</Tag>
                        </div>
                        
                        <Title level={3} style={{ marginTop: 0, marginBottom: 24, lineHeight: 1.3, fontSize: 'clamp(1.2rem, 4vw, 1.75rem)' }}>{viewThesis.title}</Title>
                        
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Card size="small" title={<Text strong style={{ color: '#1e293b', fontSize: 15 }}><FileTextOutlined style={{ marginRight: 6 }}/> Abstract Overview</Text>} variant="borderless" style={{ background: '#f8fafc', borderLeft: `4px solid #cbd5e1`, borderRadius: '0 8px 8px 0' }}>
                                    <Paragraph style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 0, whiteSpace: 'pre-wrap', color: '#444' }}>
                                        {viewThesis.abstract || 'No abstract is publicly available for this document.'}
                                    </Paragraph>
                                </Card>
                            </Col>
                            
                            <Col xs={24} sm={12}>
                                <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>Primary Author</Text>
                                <Text strong style={{ fontSize: 18, color: '#222' }}>{viewThesis.author}</Text>
                            </Col>

                            {viewThesis.co_author && (
                                <Col xs={24} sm={12}>
                                    <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>Co-Authors</Text>
                                    <Text strong style={{ fontSize: 18, color: '#222' }}>{viewThesis.co_author}</Text>
                                </Col>
                            )}

                            <Col xs={24} sm={12}>
                                <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>Institution & Year</Text>
                                <Text strong style={{ fontSize: 18, color: '#222' }}>{viewThesis.institution || 'Institutional Record'} <span style={{ opacity: 0.5, margin: '0 8px' }}>•</span> {dayjs(viewThesis.submission_date || viewThesis.created_at).format('YYYY')}</Text>
                            </Col>
                            
                            {viewThesis.doi && (
                                <Col xs={24} sm={12}>
                                    <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>DOI Reference</Text>
                                    <Text strong style={{ fontSize: 18, color: '#222' }}>{viewThesis.doi}</Text>
                                </Col>
                            )}

                            <Col span={24}>
                                <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 12 }}>Indexed Keywords</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {(viewThesis.keywords || []).map(k => (
                                        <Tag key={k} color="#94a3b8" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 4, fontWeight: 600 }}>{k}</Tag>
                                    ))}
                                    {(!viewThesis.keywords || viewThesis.keywords.length === 0) && <Text type="secondary">N/A</Text>}
                                </div>
                            </Col>
                        </Row>

                        <Divider />
                        
                        <div style={{ textAlign: 'center', padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 24px)', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                            <LockOutlined style={{ fontSize: 40, color: '#64748b', marginBottom: 16 }} />
                            <Title level={4} style={{ color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Confidential Resource</Title>
                            <Text style={{ color: '#475569', fontSize: 15, display: 'block', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px auto' }}>
                                The full manuscript, raw methodology, and dataset results are strictly shielded for internal use. Access is restricted to authorized clients securely connected to the Intranet Portal.
                            </Text>
                            <Link to="/login">
                                <Button type="primary" size="large" style={{ background: '#334155', borderRadius: 8, fontWeight: 800, padding: '0 32px', height: 48, fontSize: 15 }}>
                                    See more... Login to Portal
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
}
