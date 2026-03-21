import React from 'react';
import { Table, Tag, Space, Button, Typography, Avatar } from 'antd';
import { FilePdfOutlined, EditOutlined, DeleteOutlined, EyeOutlined, Clock } from '@ant-design/icons';
import { Calendar } from 'lucide-react';

const { Text } = Typography;

const tableThesis = React.memo(({ 
    columns, 
    dataSource, 
    loading, 
    activeTab, 
    onPreview, 
    onEdit, 
    onDelete,
    screens
}) => {
    // Note: columns are pre-configured in the parent for search props etc.
    // But we can customize them here if needed.
    
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{ 
                defaultPageSize: 10, 
                showSizeChanger: true, 
                pageSizeOptions: ['10', '25', '50'], 
                showTotal: (total) => <Text type="secondary">{total} theses found</Text>, 
                style: { padding: '16px 24px' } 
            }}
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            onRow={(record) => ({
                onClick: () => {
                    if (activeTab === 'preview') onPreview(record);
                    else if (activeTab === 'modify') onEdit(record);
                    else if (activeTab === 'remove') onDelete(record.key);
                },
                style: { cursor: 'pointer' }
            })}
        />
    );
});

export default tableThesis;
