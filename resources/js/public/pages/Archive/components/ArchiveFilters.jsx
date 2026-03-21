import React from 'react';
import { Typography, Space, Tag, Divider, BookOutlined } from 'antd';

const { Title, Text } = Typography;

const ArchiveFilters = ({ 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    filteredCount, 
    searchQuery, 
    setSearchQuery,
    primaryColor
}) => {
    return (
        <div id="search" style={{ padding: 'clamp(40px, 6vw, 60px) 5%', maxWidth: 1400, margin: '0 auto' }}>
            <div id="categories" style={{ marginBottom: 40 }}>
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <BookOutlined style={{ color: primaryColor }} /> Research Categories
                </Title>
                <Space wrap size={[12, 16]}>
                    {categories.map(cat => (
                        <Tag.CheckableTag
                            key={cat}
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            style={{ 
                                padding: '6px 16px', fontSize: 14, borderRadius: 20,
                                border: `1px solid ${selectedCategory === cat ? primaryColor : '#d9d9d9'}`,
                                background: selectedCategory === cat ? primaryColor : '#fff',
                            }}
                        >
                            {cat}
                        </Tag.CheckableTag>
                    ))}
                </Space>
            </div>

            <Divider />

            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Showing {filteredCount} published studies</Text>
                {searchQuery && (
                    <Tag closable onClose={() => setSearchQuery('')} color="blue">
                        Search: {searchQuery}
                    </Tag>
                )}
            </div>
        </div>
    );
};

export default ArchiveFilters;
