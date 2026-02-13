import React from 'react';
import { Descriptions, Typography, theme, Space, Grid } from 'antd';
import {
    User,
    Calendar,
    Phone,
    MapPin,
    Info,
    GraduationCap
} from 'lucide-react';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function PersonalInfoView({ user }) {
    const { token } = theme.useToken();
    const { colorPrimary } = token;
    const screens = Grid.useBreakpoint();

    const LabelWithIcon = ({ icon, text }) => (
        <Space>
            {React.cloneElement(icon, { style: { color: colorPrimary } })}
            <span>{text}</span>
        </Space>
    );

    return (
        <Descriptions
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            bordered
            size="middle"
            layout={screens.xs ? 'vertical' : 'horizontal'}
            styles={{
                label: { fontWeight: 600, backgroundColor: '#fafafa' },
                content: { backgroundColor: '#fff' }
            }}
        >
            <Descriptions.Item label={<LabelWithIcon icon={<User size={18} />} text="Full Name" />}>
                <Text strong>
                    {`${user.profile?.fname || ''} ${user.profile?.mname || ''} ${user.profile?.lname || ''} ${user.profile?.suffix || ''}`.trim() || 'N/A'}
                </Text>
            </Descriptions.Item>

            <Descriptions.Item label={<LabelWithIcon icon={<Calendar size={18} />} text="Date of Birth" />}>
                {user.profile?.date_of_birth ? dayjs(user.profile.date_of_birth).format('MMMM D, YYYY') : 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label={<LabelWithIcon icon={<Phone size={18} />} text="Phone Number" />}>
                {user.profile?.phone_number || 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label={<LabelWithIcon icon={<MapPin size={18} />} text="Address" />}>
                {user.profile?.address || 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item
                label={<LabelWithIcon icon={<Info size={18} />} text="Bio" />}
                span={2}
            >
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {user.profile?.bio || 'N/A'}
                </div>
            </Descriptions.Item>

            <Descriptions.Item
                label={<LabelWithIcon icon={<GraduationCap size={18} />} text="Educational Attainment" />}
                span={2}
            >
                {user.educational_backgrounds && user.educational_backgrounds.length > 0 ? (
                    <Descriptions
                        bordered
                        size="small"
                        column={1}
                        layout="vertical"
                    >
                        {user.educational_backgrounds
                            .sort((a, b) => b.year_start - a.year_start)
                            .map((edu) => (
                                <Descriptions.Item
                                    key={edu.id}
                                    label={
                                        <Space>
                                            <Text strong>{edu.school_name}</Text>
                                            {edu.degree && <Text type="secondary">({edu.degree})</Text>}
                                        </Space>
                                    }
                                >
                                    <Space direction="vertical" size={0}>
                                        <Text>{edu.level}</Text>
                                        <Text type="secondary">{edu.year_start} - {edu.year_end || 'Present'}</Text>
                                        {edu.description && <Text type="secondary" style={{ fontSize: 12 }}>{edu.description}</Text>}
                                    </Space>
                                </Descriptions.Item>
                            ))}
                    </Descriptions>
                ) : (
                    <Text type="secondary">No educational background added.</Text>
                )}
            </Descriptions.Item>
        </Descriptions>
    );
}
