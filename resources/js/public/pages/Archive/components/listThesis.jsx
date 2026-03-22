import React from 'react';
import { Typography } from 'antd';
import { TagOutlined, UserOutlined, CalendarOutlined, BookOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text: AntText } = Typography;

const listThesis = ({ selectedCategory, filteredTheses, onSelect, primaryColor }) => {
    return (
        <div style={{ maxWidth: 1050, margin: '0 auto', background: '#fff', padding: '48px 64px', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
            <div style={{ marginBottom: 32 }}>
                <AntText style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>Home &gt; <span style={{ color: primaryColor, cursor: 'pointer', textDecoration: 'underline' }}>Theses and Dissertations</span> &gt; <AntText type="secondary">{selectedCategory}</AntText></AntText>
            </div>
            
            <div style={{ borderBottom: `3px solid #f59e0b`, display: 'inline-block', paddingBottom: 12, marginBottom: 24 }}>
                <Title level={2} style={{ color: '#475569', textTransform: 'uppercase', margin: 0, letterSpacing: -0.5 }}>
                    {selectedCategory}
                </Title>
            </div>
            
            <AntText style={{ display: 'block', marginBottom: 48, fontSize: 15, color: '#64748b', fontWeight: 500 }}>
                Theses and dissertations submitted to {selectedCategory}
            </AntText>
            
            <Title level={4} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 16, color: '#64748b', marginBottom: 32, fontWeight: 500 }}>
                Items in this Collection
            </Title>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {filteredTheses.map(item => (
                    <div key={item.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: 32 }}>
                        <AntText 
                            style={{ fontSize: 18, color: '#2563eb', cursor: 'pointer', fontWeight: 600, display: 'block', marginBottom: 12, transition: 'color 0.2s', lineHeight: 1.4 }} 
                            onClick={() => onSelect(item)} 
                            className="dspace-title-hover"
                        >
                            {item.title}
                        </AntText>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', color: '#64748b', fontSize: 13, marginBottom: 20 }}>
                            <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><UserOutlined style={{ marginRight: 6 }}/> By <AntText strong style={{ color: '#475569', marginLeft: 4 }}>{item.author}</AntText></span>
                            <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><CalendarOutlined style={{ marginRight: 6 }}/> {dayjs(item.submission_date || item.created_at).format('DD MMMM YYYY')}</span>
                            <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><BookOutlined style={{ marginRight: 6 }}/> Thesis/Dissertation</span>
                        </div>
                        
                        <div style={{ paddingLeft: 20, borderLeft: '4px solid #e2e8f0', color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>
                            {item.abstract ? (item.abstract.length > 400 ? item.abstract.substring(0, 400) + '...' : item.abstract) : 'No abstract overtly provided ...'}
                        </div>
                        
                        {(item.keywords && item.keywords.length > 0) && (
                            <div>
                               <TagOutlined style={{ marginRight: 8, color: '#94a3b8' }}/> 
                               <AntText style={{ fontSize: 13, color: '#475569' }}>
                                   {item.keywords.join('; ')}
                               </AntText>
                            </div>
                        )}
                    </div>
                ))}
                {filteredTheses.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        <i>No records dynamically matched within this specific program boundary.</i>
                    </div>
                )}
            </div>
        </div>
    );
};

export default listThesis;
