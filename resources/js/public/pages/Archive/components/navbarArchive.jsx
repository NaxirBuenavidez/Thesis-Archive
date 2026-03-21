import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Title: AntTitle } = Typography;

const navbarArchive = React.memo(({ 
    logoPath, 
    siteTitle, 
    appName, 
    primaryColor, 
    primaryDark, 
    activeSection, 
    navItems, 
    scrollToSection,
    onMobileMenuOpen 
}) => {
    return (
        <Header style={{ 
            position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 5%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
                {logoPath ? (
                    <img src={logoPath} alt="Logo" style={{ height: 40 }} />
                ) : (
                    <div style={{ width: 40, height: 40, background: primaryColor, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        {siteTitle ? siteTitle.substring(0, 2).toUpperCase() : 'DA'}
                    </div>
                )}
                <AntTitle level={4} style={{ margin: 0, color: primaryDark, letterSpacing: 0.5 }}>{appName}</AntTitle>
            </div>
            
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
            
            <Button 
                type="text" 
                icon={<MenuOutlined style={{ fontSize: 24, color: primaryDark }} />} 
                className="mobile-nav-btn"
                onClick={onMobileMenuOpen}
                style={{ background: 'transparent', border: 'none', padding: 0, height: 'auto', display: 'flex', alignItems: 'center' }}
            />
        </Header>
    );
});

export default navbarArchive;
