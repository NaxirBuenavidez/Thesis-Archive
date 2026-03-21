import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Typography, Button, theme, Grid, App } from 'antd';
import { Modal } from 'antd';
import { Shield, Edit, Plus, GraduationCap } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import ProfileHeader from './viewProfileHeader';
import PersonalInfoView from './viewPersonalInfo';
import PersonalInfoForm from './formPersonalInfo';
import AccountSettingsModal from './modalAccountSettings';
import EducationalBackgroundView from './viewEducationalBackground';
import EducationalBackgroundForm from './formEducationalBackground';
import { getEducation } from '../../../private/api/profile';

const { Title, Text } = Typography;

export default function Profile() {
    const { user, checkAuth } = useAuth();
    const { message } = App.useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [education, setEducation] = useState([]);
    const [editingEdu, setEditingEdu] = useState(null);
    const [showEduForm, setShowEduForm] = useState(false);

    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();
    const { colorPrimary, borderRadiusLG } = token;

    const fetchEducation = useCallback(async () => {
        try {
            const res = await getEducation();
            setEducation(res.data);
        } catch (err) {
            // silently fail – user may have no entries yet
        }
    }, []);

    useEffect(() => {
        fetchEducation();
    }, [fetchEducation]);

    const handleEduSuccess = () => {
        setShowEduForm(false);
        setEditingEdu(null);
        fetchEducation();
    };

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
                    {/* Personal Info Card */}
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
                        style={{ borderRadius: borderRadiusLG, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}
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

                    {/* Educational Background Card */}
                    <Card
                        title={
                            <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <GraduationCap size={18} />
                                Educational Background
                            </span>
                        }
                        extra={
                            !showEduForm && (
                                <Button
                                    type="text"
                                    icon={<Plus size={16} />}
                                    onClick={() => { setEditingEdu(null); setShowEduForm(true); }}
                                    style={{ color: colorPrimary }}
                                >
                                    {!screens.xs && 'Add Record'}
                                </Button>
                            )
                        }
                        variant="borderless"
                        style={{ borderRadius: borderRadiusLG, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        {showEduForm ? (
                            <EducationalBackgroundForm
                                initialValues={editingEdu}
                                onCancel={() => { setShowEduForm(false); setEditingEdu(null); }}
                                onSuccess={handleEduSuccess}
                            />
                        ) : (
                            <EducationalBackgroundView
                                education={education}
                                onEdit={(item) => { setEditingEdu(item); setShowEduForm(true); }}
                                refreshData={fetchEducation}
                            />
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
