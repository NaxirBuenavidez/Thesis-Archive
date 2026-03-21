import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { HomeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const footerArchive = React.memo(({ logoPath, primaryColor, primaryDark, appName }) => {
    return (
        <Footer style={{ background: '#efefef', color: '#333', padding: '60px 5% 40px', borderTop: `4px solid ${primaryDark}`, position: 'relative', zIndex: 1 }}>
            <Row gutter={[48, 32]}>
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="https://pecit.edu.ph/" target="_blank" rel="noopener noreferrer">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                    <img src="/images/pecit-logo.png" alt="PECIT Logo" style={{ height: 100, objectFit: 'contain' }} />
                                    <Text strong style={{ color: primaryDark, fontSize: 14, lineHeight: 1.2 }}>PECIT</Text>
                                </div>
                            </a>
                            <div style={{ width: 1, height: 60, background: '#ccc', opacity: 0.5 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <img src="/images/ptas-logo.png" alt="PTAS Logo" style={{ height: 100, objectFit: 'contain' }} />
                                <Text strong style={{ color: primaryDark, fontSize: 14, lineHeight: 1.2 }}>PTAS</Text>
                            </div>
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
                
                <Col xs={24} md={5}>
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
                
                <Col xs={24} md={5}>
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
    );
});

export default footerArchive;
