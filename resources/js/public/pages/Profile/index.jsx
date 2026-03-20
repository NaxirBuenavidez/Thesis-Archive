import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, theme, Grid } from 'antd';
import { Shield, Edit } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; // Updated path
import ProfileHeader from './viewProfileHeader';
import PersonalInfoView from './viewPersonalInfo';
import PersonalInfoForm from './formPersonalInfo';
import AccountSettingsModal from './modalAccountSettings';
import { Modal } from 'antd'; // Import Modal

const { Title, Text } = Typography;

export default function Profile() {
    const { user, checkAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const screens = Grid.useBreakpoint();

    const { token } = theme.useToken();
    const { colorPrimary, borderRadiusLG } = token;








    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
                marginBottom: 24,
                display: 'flex',
                flexDirection: screens.xs ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: screens.xs ? 'flex-start' : 'center',
                gap: screens.xs ? 16 : 0
            }}>
                <div>
                    <Title level={2} style={{ margin: 0, color: colorPrimary }}>My Profile</Title>
                    <Text type="secondary">Manage your personal information</Text>
                </div>
                <Button
                    icon={<Shield size={16} />}
                    onClick={() => setIsModalOpen(true)}
                    style={{ width: screens.xs ? '100%' : 'auto' }}
                >
                    Account Settings
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={24} lg={6}>
                    <ProfileHeader user={user} checkAuth={checkAuth} />
                </Col>

                <Col xs={24} md={24} lg={18}>
                    <Card
                        title={<span style={{ fontSize: 18 }}>Personal Information</span>}
                        extra={
                            !isEditing && (
                                <Button
                                    type="text"
                                    icon={<Edit size={16} />}
                                    onClick={() => setIsEditing(true)}
                                    style={{ color: colorPrimary }}
                                >
                                    {!screens.xs && 'Edit Details'}
                                </Button>
                            )
                        }

                        variant="borderless"
                        style={{
                            borderRadius: borderRadiusLG,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                    >
                        {isEditing ? (
                            <PersonalInfoForm
                                user={user}
                                checkAuth={checkAuth}
                                onCancel={() => setIsEditing(false)}
                                onSuccess={() => setIsEditing(false)}
                            />
                        ) : (
                            <PersonalInfoView user={user} />
                        )}
                    </Card>
                </Col>
            </Row>



            <AccountSettingsModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                user={user}
                checkAuth={checkAuth}
            />


        </div>
    );
}
