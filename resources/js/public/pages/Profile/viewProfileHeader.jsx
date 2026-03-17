import React, { useState } from 'react';
import { Card, Avatar, Upload, Button, Typography, Tag, Divider, Spin, message, theme, Grid } from 'antd';
import { User, Camera } from 'lucide-react';
import dayjs from 'dayjs';
import { uploadAvatar } from '../../../private/api/profile';

const { Title, Text } = Typography;

export default function ProfileHeader({ user, checkAuth }) {
    const [avatarLoading, setAvatarLoading] = useState(false);
    const { token } = theme.useToken();
    const { colorPrimary, borderRadiusLG } = token;
    const screens = Grid.useBreakpoint();

    const handleAvatarUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append('avatar', file);

        setAvatarLoading(true);
        try {
            await uploadAvatar(formData);
            message.success('Avatar updated successfully');
            checkAuth(); // Refresh user data
        } catch (error) {
            console.error(error);
            message.error('Failed to upload avatar');
        } finally {
            setAvatarLoading(false);
        }
    };

    return (
        <Card
            variant="borderless"
            style={{
                textAlign: 'center',
                borderRadius: borderRadiusLG,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
        >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                <Avatar
                    size={!screens.lg ? 120 : 160}
                    src={user.profile?.avatar ? (user.profile.avatar.startsWith('http') || user.profile.avatar.startsWith('data:image') ? user.profile.avatar : `/storage/${user.profile.avatar}`) : null}
                    icon={<User size={!screens.lg ? 48 : 64} />}
                    style={{
                        border: `4px solid ${colorPrimary}`,
                        backgroundColor: '#f0f2f5'
                    }}
                />
                <Upload
                    showUploadList={false}
                    customRequest={handleAvatarUpload}
                    accept="image/*"
                >
                    <Button
                        type="primary"
                        shape="circle"
                        icon={avatarLoading ? <Spin size="small" /> : <Camera size={16} />}
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                </Upload>
            </div>

            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ marginBottom: 4 }}>{user.name}</Title>
                <Tag color="blue" variant="filled" style={{ fontSize: 13, padding: '2px 10px' }}>
                    {user.role?.title || 'User'}
                </Tag>
            </div>

            <div style={{ textAlign: !screens.lg ? 'center' : 'left' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Email Address</Text>
                <Text strong style={{ fontSize: 16 }}>{user.email}</Text>
                <Divider style={{ margin: '16px 0' }} />
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Joined</Text>
                <Text strong>{dayjs(user.created_at).format('MMMM D, YYYY')}</Text>
            </div>
        </Card>
    );
}
