import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Space, Row, Col, ColorPicker } from 'antd';
import { UploadOutlined, BuildOutlined, BgColorsOutlined } from '@ant-design/icons';
import { useSystemConfig } from '../../../../context/SystemConfigContext';

const { Title, Text } = Typography;

export default function TabBranding() {
    const { refreshSettings, loading, site_title, site_description, primary_color, primary_color_dark, logo_path } = useSystemConfig();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (!loading) {
            form.setFieldsValue({
                site_title,
                site_description,
                primary_color,
                primary_color_dark
            });
            if (logo_path) {
                setFileList([{
                    uid: '-1',
                    name: 'Current Logo',
                    status: 'done',
                    url: logo_path,
                }]);
            }
        }
    }, [loading, site_title, site_description, primary_color, primary_color_dark, logo_path]);

    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append('site_title', values.site_title);
            formData.append('site_description', values.site_description);
            
            // Extract hex strings from ant color objects if modified
            const pColor = typeof values.primary_color === 'string' ? values.primary_color : values.primary_color.toHexString();
            const dColor = typeof values.primary_color_dark === 'string' ? values.primary_color_dark : values.primary_color_dark.toHexString();
            
            formData.append('primary_color', pColor);
            formData.append('primary_color_dark', dColor);

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('logo', fileList[0].originFileObj);
            }

            await window.axios.post('/api/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            message.success('Branding settings updated successfully. Interface will reload to reflect changes.');
            refreshSettings(); // Trigger context update globally
        } catch (error) {
            console.error('Error saving branding', error);
            message.error('Failed to save settings.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return false; // Prevent auto upload
    };

    const handleChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1); // Only keep the latest one
        setFileList(newFileList);
    };

    return (
        <Card title={<Space><BuildOutlined /> <Text strong>System Identity & Branding (CMS)</Text></Space>} styles={{ header: { background: '#fafafa' } }}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={24}>
                    <Col xs={24} lg={12}>
                        <Title level={5}>Core Identity Texts</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                            These text fields dictate the navigation headers and system titles visible globally. 
                        </Text>
                        
                        <Form.Item name="site_title" label={<Text strong>System Display Name (Header)</Text>} rules={[{ required: true }]}>
                            <Input placeholder="e.g. THESIS ARCHIVE SYSTEM" size="large" />
                        </Form.Item>

                        <Form.Item name="site_description" label={<Text strong>Institution / Subheading</Text>} rules={[{ required: true }]}>
                            <Input.TextArea rows={3} placeholder="e.g. PHILIPPINE ELECTRONICS & COMMUNICATION INSTITUTE OF TECHNOLOGY" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} lg={12}>
                        <Title level={5}>Aesthetics & Graphics</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                            Configure the organizational logo (also acts as watermarked background) and primary system hues.
                        </Text>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="primary_color" label="Primary Main Color (Buttons, Links)">
                                    <ColorPicker showText />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="primary_color_dark" label="Primary Dark Color (Sidebar)">
                                    <ColorPicker showText />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label={<Text strong>System Logo (PNG/JPG)</Text>}>
                            <Upload
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                fileList={fileList}
                                listType="picture"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Select Logo Photo</Button>
                            </Upload>
                            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                                This logo replaces the initials on the header and spans across the app as a 5% opacity watermark.
                            </Text>
                        </Form.Item>
                    </Col>
                </Row>
                
                <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" size="large" loading={submitLoading} icon={<BgColorsOutlined />}>
                        Save Branding Configuration
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
