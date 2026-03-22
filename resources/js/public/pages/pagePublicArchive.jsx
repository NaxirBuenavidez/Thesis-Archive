import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Row, Col, Pagination, Spin, Empty, Drawer, List, Space, Button } from 'antd';
import { GlobalOutlined, SearchOutlined, BookOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import publicApi from '../../api/publicApi';
import { useSystemConfig } from '../../context/SystemConfigContext';
import navbarArchive from './Archive/components/navbarArchive';
import heroArchive from './Archive/components/heroArchive';
import filtersArchive from './Archive/components/filtersArchive';
import cardThesis from './Archive/components/cardThesis';
import listThesis from './Archive/components/listThesis';
import modalThesis from './Archive/components/modalThesis';
import footerArchive from './Archive/components/footerArchive';
import '../../../css/public-archive.scss';

const { Content } = Layout;

export default function PublicArchive() {
    const { primary_color, primary_color_dark, site_title, logo_path } = useSystemConfig();
    const primaryColor = primary_color || '#2845D6';
    const primaryDark = primary_color_dark || '#1A2CA3';
    
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewThesis, setViewThesis] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [particlesInitState, setParticlesInitState] = useState(false);
    const pageSize = 12;

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInitState(true);
        });
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await publicApi.getTheses(false, { silent: true });
                setTheses(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const navItems = React.useMemo(() => [
        { label: 'Home', id: 'home', icon: <GlobalOutlined /> },
        { label: 'Search', id: 'search', icon: <SearchOutlined /> },
        { label: 'Research Categories', id: 'categories', icon: <BookOutlined /> },
        { label: 'Manual & Guides', id: 'guides', icon: <InfoCircleOutlined /> },
        { label: 'FAQ', id: 'faq', icon: <QuestionCircleOutlined /> },
    ], []);

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
                    {selectedCategory === 'All' ? (
                        <div style={{ minHeight: 400, position: 'relative', opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s ease' }}>
                            {filteredTheses.length === 0 && !loading ? (
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
                        </div>
                    ) : (
                        <ThesisListComp selectedCategory={selectedCategory} filteredTheses={filteredTheses} onSelect={setViewThesis} primaryColor={primaryColor} />
                    )}
                </div>
            </Content>

            <Footer logoPath={logo_path} primaryColor={primaryColor} primaryDark={primaryDark} appName={site_title} />

            <ThesisModal thesis={viewThesis} onClose={() => setViewThesis(null)} />

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
