import React from 'react';
import { Typography, theme } from 'antd';

const { Text } = Typography;

const footerPublic = ({ isMobile, appName, colorPrimary }) => {
    const { token } = theme.useToken();
    
    return (
        <footer style={{
            padding: isMobile ? '12px' : '16px 24px',
            marginBottom: isMobile ? 72 : 16,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
        }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <a href="https://privacy.gov.ph/" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                        <img src="/images/npc-logo.png" alt="National Privacy Commission" style={{ height: isMobile ? 40 : 56, width: 'auto', display: 'block' }} />
                    </a>
                    <div style={{ minWidth: 0 }}>
                        <a href="https://privacy.gov.ph/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Text strong style={{ fontSize: 12, display: 'block', lineHeight: 1.4, color: colorPrimary }}>
                                {isMobile ? 'Data Privacy Act (RA 10173)' : 'Data Privacy Act of 2012 (RA 10173)'}
                            </Text>
                        </a>
                        {!isMobile && (
                            <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                                This system complies with RA 10173. Personal information is handled per{' '}
                                <a href="https://privacy.gov.ph/" target="_blank" rel="noopener noreferrer" style={{ color: colorPrimary }}>NPC</a> guidelines.
                            </Text>
                        )}
                    </div>
                </div>
                <Text type="secondary" style={{ fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    &copy; {new Date().getFullYear()} {isMobile ? appName.split(' ').slice(0, 2).join(' ') : appName}. All rights reserved.
                </Text>
            </div>
        </footer>
    );
};

export default footerPublic;
