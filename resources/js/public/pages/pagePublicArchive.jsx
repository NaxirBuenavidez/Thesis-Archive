import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Row, Col, Pagination, Spin, Empty, Drawer, List, Space, Button, Typography, Carousel } from 'antd';
import { GlobalOutlined, SearchOutlined, BookOutlined, InfoCircleOutlined, QuestionCircleOutlined, ReadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import publicApi from '../../api/publicApi';
import { useSystemConfig } from '../../context/SystemConfigContext';
import { sessionCache } from '../../utils/sessionCache';
import navbarArchive from './Archive/components/navbarArchive';
import heroArchive from './Archive/components/heroArchive';
import filtersArchive from './Archive/components/filtersArchive';
import cardThesis from './Archive/components/cardThesis';
import listThesis from './Archive/components/listThesis';
import modalThesis from './Archive/components/modalThesis';
import footerArchive from './Archive/components/footerArchive';
import 'placeholder-loading/dist/css/placeholder-loading.min.css';
import '../../../css/public-archive.scss';

const { Content } = Layout;
const { Text: AntText, Title, Paragraph } = Typography;

const STYLES = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.entry-animate {
  animation: fadeInUp 0.5s ease-out forwards;
}
`;

const SkeletonCard = () => (
    <div className="ph-item" style={{ borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', marginBottom: 0, padding: 16 }}>
        <div className="ph-col-12" style={{ padding: 0 }}>
            <div className="ph-picture" style={{ height: 180, marginBottom: 16, borderRadius: 8 }}></div>
            <div className="ph-row">
                <div className="ph-col-12 big"></div>
                <div className="ph-col-8"></div>
                <div className="ph-col-4 empty"></div>
                <div className="ph-col-6"></div>
                <div className="ph-col-6 empty"></div>
            </div>
            <div className="ph-row" style={{ marginTop: 24 }}>
                <div className="ph-col-2" style={{ height: 28, borderRadius: 14 }}></div>
                <div className="ph-col-10 empty"></div>
            </div>
        </div>
    </div>
);

const SectionHeading = ({ icon, title, subtitle, primaryColor }) => (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            {typeof icon === 'string' ? (
                <img src={icon} alt="" style={{ height: 64, objectFit: 'contain' }} />
            ) : (
                <div style={{ fontSize: 40, color: primaryColor }}>{icon}</div>
            )}
        </div>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#1a202c', margin: '0 0 8px 0' }}>{title}</h2>
        <p style={{ color: '#4a5568', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>{subtitle}</p>
    </div>
);

const SectionSkeleton = ({ cards = 3 }) => (
    <Row gutter={[32, 32]}>
        {[...Array(cards)].map((_, i) => (
            <Col xs={24} md={24/cards} key={i}>
                <div className="ph-item" style={{ borderRadius: 16, border: 'none', background: '#fff', padding: 32 }}>
                    <div className="ph-col-12" style={{ padding: 0 }}>
                        <div className="ph-avatar" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 24 }}></div>
                        <div className="ph-row">
                            <div className="ph-col-8 big"></div>
                            <div className="ph-col-12"></div>
                            <div className="ph-col-10"></div>
                        </div>
                    </div>
                </div>
            </Col>
        ))}
    </Row>
);

const GuidesSection = ({ primaryColor, primaryDark }) => {
    const { user_manual_path, research_policy_path, submission_guide_path } = useSystemConfig();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const guides = [
        { title: 'User Manual', desc: 'Step-by-step navigation guide.', icon: user_manual_path || '/images/user-manual.png' },
        { title: 'Research Policy', desc: 'Intellectual property rules.', icon: research_policy_path || '/images/research-policy.png' },
        { title: 'Submission Guide', desc: "Archive preparation guidelines.", icon: submission_guide_path || '/images/submission-guide.png' }
    ];

    return (
        <div id="guides" style={{ padding: '100px 5%', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <SectionHeading 
                    icon={<BookOutlined />} 
                    title="Manual & Guides" 
                    subtitle="Premium documentation and policies for our digital thesis archive."
                    primaryColor={primaryColor}
                />
                
                {isLoading ? (
                    <SectionSkeleton cards={3} />
                ) : (
                    <Row gutter={[48, 48]} justify="center">
                        {guides.map((g, i) => (
                            <Col xs={24} md={8} key={i}>
                                <div className="guide-card" style={{ 
                                    padding: 48, 
                                    background: '#f8fafc', 
                                    borderRadius: 32, 
                                    height: '100%', 
                                    border: '1px solid rgba(0,0,0,0.02)', 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <div style={{ 
                                        width: '100%', 
                                        maxWidth: 280, 
                                        aspectRatio: '1/1', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        marginBottom: 32 
                                    }} className="entry-animate">
                                        <img src={g.icon} alt={g.title} style={{ width: '120%', height: '120%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }} />
                                    </div>
                                    <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: primaryDark }}>{g.title}</h3>
                                    <p style={{ color: '#666', fontSize: 16, lineHeight: 1.6, margin: 0, maxWidth: 300 }}>{g.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
            <div style={{ maxWidth: 1000, margin: '60px auto 0', padding: '60px 40px', background: '#fff', borderRadius: 32, border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', textAlign: 'center' }}>
                <h4 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40, color: primaryDark }}>Why use the Archive?</h4>
                <Carousel autoplay effect="fade" className="why-archive-slider" dots={{ className: 'why-archive-dots' }}>
                    <div style={{ padding: '10px 20px' }}>
                        <h5 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Centralized Metadata Hub</h5>
                        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
                            A unified, secure repository for all institutional research. Our system consolidates decades of academic excellence into a single, easily navigable digital platform.
                        </p>
                    </div>
                    <div style={{ padding: '10px 20px' }}>
                        <h5 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Accelerated Discovery</h5>
                        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
                            Instant access to abstracts and detailed metadata. Researchers can find relevant studies in seconds using our advanced filtering and search algorithms.
                        </p>
                    </div>
                    <div style={{ padding: '10px 20px' }}>
                        <h5 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Enhanced Academic Visibility</h5>
                        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
                            Broaden the impact of your work. The archive ensures that student and faculty research is discoverable by the global academic community and future scholars.
                        </p>
                    </div>
                    <div style={{ padding: '10px 20px' }}>
                        <h5 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Digital Preservation Standards</h5>
                        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
                            Standards-compliant archival ensuring long-term accessibility. We protect intellectual property with robust backups and modern data preservation formats.
                        </p>
                    </div>
                </Carousel>
                <div style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 24 }}>
                    <AntText type="secondary" style={{ fontStyle: 'italic', fontSize: 16 }}>
                        "Advancing academic transparency through digital innovation."
                    </AntText>
                </div>
            </div>
        </div>
    );
};

const PrivacySection = ({ primaryColor, primaryDark }) => {
    return (
        <div id="privacy" style={{ padding: '80px 5%', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <SectionHeading 
                    icon="/images/npc-logo.png" 
                    title="Data Privacy & NPC Compliance" 
                    subtitle="We are committed to protecting your research data and adhering to the Data Privacy Act of 2012 (RA 10173)."
                    primaryColor={primaryColor}
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center', background: '#fff', padding: 40, borderRadius: 24, border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '100%' }}>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: primaryDark, marginBottom: 20 }}>Your Data, Protected.</h3>
                        <p style={{ color: '#4a5568', fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                            This digital archive exclusively serves the thesis research output of our brilliant students and faculty. 
                            In compliance with the <strong>National Privacy Commission (NPC)</strong>, we ensure that all metadata and 
                            abstracts are handled with strict confidentiality and used solely for academic referencing.
                        </p>
                        <Row gutter={[20, 20]}>
                            <Col xs={24} sm={12}>
                                <div style={{ padding: 20, background: '#f8fafc', borderRadius: 12, height: '100%' }}>
                                    <AntText strong style={{ display: 'block', marginBottom: 8, fontSize: 16 }}>Academic Use Only</AntText>
                                    <AntText style={{ fontSize: 13, color: '#666' }}>All research materials are processed strictly for academic citation and verification purposes.</AntText>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div style={{ padding: 20, background: '#f8fafc', borderRadius: 12, height: '100%' }}>
                                    <AntText strong style={{ display: 'block', marginBottom: 8, fontSize: 16 }}>RA 10173 Compliant</AntText>
                                    <AntText style={{ fontSize: 13, color: '#666' }}>Full adherence to the Philippine Data Privacy laws ensuring your intellectual property is safe.</AntText>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 40, width: '100%' }}>
                        <Row gutter={[20, 20]} justify="center" align="middle">
                            <Col xs={12} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <AntText strong style={{ display: 'block', fontSize: 12 }}>TRANSPARENCY</AntText>
                                    <AntText type="secondary" style={{ fontSize: 11 }}>Clear data usage policies.</AntText>
                                </div>
                            </Col>
                            <Col xs={12} md={8}>
                                <img src="/images/npc-logo.png" alt="NPC Seal" style={{ height: 100, objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
                            </Col>
                            <Col xs={12} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <AntText strong style={{ display: 'block', fontSize: 12 }}>LEGITIMACY</AntText>
                                    <AntText type="secondary" style={{ fontSize: 11 }}>Strict academic purpose.</AntText>
                                </div>
                            </Col>
                        </Row>
                        <AntText strong style={{ display: 'block', marginTop: 16, fontSize: 14, color: '#666', letterSpacing: 1 }}>NPC COMPLIANT SYSTEM</AntText>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function PublicArchive() {
    const { primary_color, primary_color_dark, site_title, logo_path } = useSystemConfig();
    const primaryColor = primary_color || '#2845D6';
    const primaryDark = primary_color_dark || '#1A2CA3';
    
    const [theses, setTheses] = useState(sessionCache.get('public_theses') || []);
    const [loading, setLoading] = useState(!sessionCache.get('public_theses'));
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewThesis, setViewThesis] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [particlesInitState, setParticlesInitState] = useState(false);
    const pageSize = 12;

    const navItems = React.useMemo(() => [
        { label: 'Home', id: 'home', icon: <GlobalOutlined /> },
        { label: 'Search', id: 'search', icon: <SearchOutlined /> },
        { label: 'Research Categories', id: 'categories', icon: <BookOutlined /> },
        { label: 'Manual & Guides', id: 'guides', icon: <ReadOutlined /> },
        { label: 'Privacy & Compliance', id: 'privacy', icon: <SafetyCertificateOutlined /> },
    ], []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

        navItems.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [navItems]);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInitState(true);
        });
    }, []);

    useEffect(() => {
        const load = async () => {
            // Skip initial fetch if data was pre-loaded
            if (theses.length > 0) {
                setLoading(false);
                return;
            }

            try {
                const data = await publicApi.getTheses(false, { silent: true });
                setTheses(data);
                sessionCache.set('public_theses', data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [theses.length]);

    const categories = useMemo(() => {
        const cats = new Set(theses.map(t => t.department || 'General'));
        return ['All', ...Array.from(cats)].sort();
    }, [theses]);

    const filteredTheses = useMemo(() => {
        setCurrentPage(1);
        return theses.filter(t => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = (t.title?.toLowerCase() || '').includes(query) || 
                                  (t.author?.toLowerCase() || '').includes(query) ||
                                  (t.keywords || []).some(k => k.toLowerCase().includes(query));
            const matchesCategory = selectedCategory === 'All' || t.department === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [theses, searchQuery, selectedCategory]);

    const scrollToSection = React.useCallback((id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 85; 
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    const svgHex = primaryColor.replace('#', '%23');
    const tileBg = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${svgHex}' fill-opacity='0.03'%3E%3Cpath d='M12 3L1 9L4 10.63V17L12 21L20 17V10.63L21 10.09V17H23V9L12 3ZM12 5.18L19.31 9.14L12 13.1L4.69 9.14L12 5.18ZM6 12.38L12 15.64L18 12.38V15.74L12 18.99L6 15.74V12.38Z' transform='translate(15, 15) scale(1.6)'/%3E%3Cpath d='M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.84 1.18 21 1.39 21C1.43 21 1.48 21 1.52 20.98C2.86 20.35 4.88 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.3 20.65 15.82 20 17.5 20C19.16 20 20.97 20.3 22.42 21C22.61 21.1 22.84 21.05 22.95 20.86C22.98 20.8 23 20.73 23 20.65V6C22.4 5.6 21.73 5.27 21 5ZM21 18.5C19.9 18.15 18.73 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.73 6.5 19.9 6.65 21 7V18.5Z' transform='translate(65, 65) scale(1.3)'/%3E%3C/g%3E%3C/svg%3E")`;

    const particlesConfig = {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
            },
        },
        particles: {
            color: { value: primaryColor },
            links: {
                color: primaryColor,
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 0.8,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 40,
            },
            opacity: { value: 0.2 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    };

    const Navbar = navbarArchive;
    const Hero = heroArchive;
    const Filters = filtersArchive;
    const ThesisCardComp = cardThesis;
    const ThesisListComp = listThesis;
    const ThesisModal = modalThesis;
    const Footer = footerArchive;

    return (
        <Layout className="public-archive-layout" style={{ background: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
            <style>{STYLES}</style>
            {particlesInitState && (
                <Particles
                    id="tsparticles"
                    options={particlesConfig}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
                />
            )}
            <div className="archive-tile-bg" style={{ backgroundImage: tileBg, opacity: 0.4, zIndex: 1 }} />
            
            <Navbar 
                logoPath={logo_path} 
                siteTitle={site_title} 
                appName={site_title} 
                primaryColor={primaryColor} 
                primaryDark={primaryDark}
                activeSection={activeSection}
                navItems={navItems}
                scrollToSection={scrollToSection}
                onMobileMenuOpen={() => setMobileMenuOpen(true)}
            />

            <Content>
                <Hero 
                    primaryColor={primaryColor} 
                    primaryDark={primaryDark}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    scrollToSection={scrollToSection}
                />

                <Filters 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    filteredCount={filteredTheses.length}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    primaryColor={primaryColor}
                />

                <div style={{ padding: '0 5% 60px', maxWidth: 1400, margin: '0 auto' }}>
                    <div style={{ minHeight: 400, position: 'relative', transition: 'opacity 0.3s ease' }}>
                        {loading ? (
                            <Row gutter={[24, 24]}>
                                {[...Array(8)].map((_, i) => (
                                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={i}>
                                        <SkeletonCard />
                                    </Col>
                                ))}
                            </Row>
                        ) : selectedCategory === 'All' ? (
                            <>
                                {filteredTheses.length === 0 ? (
                                    <Empty description="No public records match your search criteria." style={{ margin: '60px 0' }} />
                                ) : (
                                    <>
                                        <Row gutter={[24, 24]}>
                                            {filteredTheses.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(item => (
                                                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={item.id}>
                                                    <ThesisCardComp item={item} primaryColor={primaryColor} primaryDark={primaryDark} onClick={setViewThesis} />
                                                </Col>
                                            ))}
                                        </Row>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                                            <Pagination current={currentPage} pageSize={pageSize} total={filteredTheses.length} onChange={setCurrentPage} showSizeChanger={false} />
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <ThesisListComp selectedCategory={selectedCategory} filteredTheses={filteredTheses} onSelect={setViewThesis} primaryColor={primaryColor} />
                        )}
                    </div>
                </div>

                <GuidesSection primaryColor={primaryColor} primaryDark={primaryDark} />
                <PrivacySection primaryColor={primaryColor} primaryDark={primaryDark} />
            </Content>

            <Footer logoPath={logo_path} primaryColor={primaryColor} primaryDark={primaryDark} appName={site_title} />

            <ThesisModal thesis={viewThesis} onClose={() => setViewThesis(null)} primaryColor={primaryColor} primaryDark={primaryDark} />

            <Drawer
                title={<span style={{ color: primaryDark }}>Menu</span>}
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
            >
                <List
                    dataSource={navItems}
                    renderItem={item => (
                        <List.Item 
                            onClick={() => {
                                scrollToSection(item.id);
                                setMobileMenuOpen(false);
                            }}
                            style={{ cursor: 'pointer', border: 'none', padding: '16px 0' }}
                        >
                            <Space style={{ color: activeSection === item.id ? primaryColor : '#555', fontWeight: activeSection === item.id ? 600 : 400 }}>
                                {item.icon}
                                {item.label}
                            </Space>
                        </List.Item>
                    )}
                />
                <div style={{ marginTop: 24 }}>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button type="primary" block style={{ background: primaryColor, borderRadius: 6, height: 45 }}>
                            Admin / Client Portal
                        </Button>
                    </Link>
                </div>
            </Drawer>
        </Layout>
    );
}
