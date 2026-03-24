import React, { useEffect } from 'react';
import { Layout, Button, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useSystemConfig } from '../../../context/SystemConfigContext';
import Navbar from './navbarArchive';
import Footer from './footerArchive';

const { Content } = Layout;
const { Title, Text } = Typography;

const SubPageLayout = ({ children, title, subtitle }) => {
    const navigate = useNavigate();
    const { primary_color, primary_color_dark, site_title, logo_path } = useSystemConfig();
    const primaryColor = primary_color || '#2845D6';
    const primaryDark = primary_color_dark || '#1A2CA3';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navItems = React.useMemo(() => [
        { label: 'Home', id: 'home', icon: <HomeOutlined /> },
    ], []);

    const handleNavClick = (id) => {
        if (id === 'home') navigate('/archive');
        else window.location.href = `/archive#${id}`;
    };

    return (
        <Layout style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar 
                logoPath={logo_path} 
                siteTitle={site_title} 
                appName={site_title} 
                primaryColor={primaryColor} 
                primaryDark={primaryDark}
                activeSection={null}
                navItems={navItems}
                scrollToSection={handleNavClick}
                onMobileMenuOpen={() => {}} 
            />
            
            <Content style={{ flex: '1 0 auto', width: '100%', position: 'relative' }}>
                <div style={{ 
                    background: `linear-gradient(135deg, ${primaryDark} 0%, ${primaryColor} 100%)`, 
                    padding: '80px 5% 100px', 
                    textAlign: 'center',
                    color: '#fff',
                    marginBottom: -40,
                    position: 'relative',
                    zIndex: 0
                }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <Title style={{ color: '#fff', fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 800, marginBottom: 16 }}>{title}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18 }}>{subtitle}</Text>
                    </div>
                </div>

                <div style={{ 
                    maxWidth: 1000, 
                    margin: '0 auto', 
                    padding: '0 5% 80px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ 
                        background: '#fff', 
                        padding: '40px 5%', 
                        borderRadius: 24, 
                        boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.03)'
                    }}>
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/archive')}
                            style={{ marginBottom: 32, padding: 0, color: primaryColor, fontWeight: 600 }}
                        >
                            Back to Archive
                        </Button>
                        
                        {children}
                        
                        <Divider style={{ margin: '60px 0 40px' }} />
                        
                        <div style={{ textAlign: 'center' }}>
                            <Space direction="vertical" size="small">
                                <Text strong style={{ color: primaryDark }}>Still need help?</Text>
                                <Link to="/archive#footer-faq">
                                    <Button type="primary" style={{ background: primaryColor, borderRadius: 8, height: 40 }}>
                                        Contact Support
                                    </Button>
                                </Link>
                            </Space>
                        </div>
                    </div>
                </div>
            </Content>
            
            <Footer logoPath={logo_path} primaryColor={primaryColor} primaryDark={primaryDark} appName={site_title} />
        </Layout>
    );
};

export default SubPageLayout;
