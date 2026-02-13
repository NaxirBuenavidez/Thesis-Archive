import React, { useState } from 'react';
import { List, Typography, Button, Space, theme, Popconfirm, message } from 'antd';
import { Edit, Trash2, GraduationCap } from 'lucide-react';
import { deleteEducation } from '../../../private/api/profile';

const { Text, Title } = Typography;

export default function EducationalBackgroundView({ education, onEdit, refreshData }) {
    const { token } = theme.useToken();
    const { colorPrimary } = token;

    const handleDelete = async (id) => {
        try {
            await deleteEducation(id);
            message.success('Education deleted successfully');
            refreshData();
        } catch (error) {
            console.error(error);
            message.error('Failed to delete education');
        }
    };

    if (!education || education.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '24px 0', color: token.colorTextSecondary }}>
                <GraduationCap size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <Text display="block">No educational background added yet.</Text>
            </div>
        );
    }

    return (
        <List
            itemLayout="horizontal"
            dataSource={education}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button
                            type="text"
                            icon={<Edit size={16} />}
                            onClick={() => onEdit(item)}
                            style={{ color: colorPrimary }}
                        />,
                        <Popconfirm
                            title="Delete education"
                            description="Are you sure to delete this education?"
                            onConfirm={() => handleDelete(item.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<Trash2 size={16} />}
                            />
                        </Popconfirm>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: token.colorFillSecondary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <GraduationCap size={20} color={colorPrimary} />
                            </div>
                        }
                        title={
                            <Space align="center">
                                <Text strong>{item.school_name}</Text>
                                {item.degree && <Text type="secondary">({item.degree})</Text>}
                            </Space>
                        }
                        description={
                            <Space direction="vertical" size={0}>
                                <Text type="secondary">{item.level}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {item.year_start} - {item.year_end || 'Present'}
                                </Text>
                                {item.description && <Text>{item.description}</Text>}
                            </Space>
                        }
                    />
                </List.Item>
            )}
        />
    );
}
