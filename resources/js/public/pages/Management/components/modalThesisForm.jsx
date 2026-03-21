import React from 'react';
import { Modal, Form, Input, Row, Col, Select, DatePicker, Upload, Switch, Divider, Space, Button, Typography } from 'antd';
import { FileTextOutlined, InboxOutlined, FilePdfOutlined, ReadOutlined, GlobalOutlined, TagsOutlined, CalendarOutlined } from '@ant-design/icons';
import { validationRules } from '../../../../utils/formUtils';

const { TextArea } = Input;
const { Text, Title } = Typography;

const modalThesisForm = React.memo(({ 
    open, 
    onCancel, 
    onFinish, 
    form, 
    loading, 
    editingId, 
    departments, 
    programs, 
    selectedDeptId, 
    setSelectedDeptId,
    pdfFileList,
    setPdfFileList,
    existingPdfName,
    primaryColor,
    isMobile
}) => {
    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={isMobile ? '100%' : 850}
            style={{ maxWidth: 'calc(100vw - 32px)', top: isMobile ? 0 : undefined, margin: isMobile ? 0 : undefined, padding: isMobile ? 0 : undefined }}
            styles={{ body: { padding: '32px 24px', maxHeight: isMobile ? '90vh' : '85vh', overflowY: 'auto' } }}
            destroyOnClose
        >
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                    {editingId ? 'Edit Thesis Record' : 'Archive New Thesis'}
                </Title>
                <Text type="secondary">Ensure all mandatory fields are filled correctly before submission.</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} size="large" requiredMark="optional">
                <Divider orientation="left" style={{ marginTop: 0 }}><ReadOutlined /> Basic Information</Divider>
                <Row gutter={24}>
                    <Col xs={24}>
                        <Form.Item name="title" label="Thesis Title" rules={[validationRules.required('thesis title')]}>
                            <Input placeholder="Enter the full title of the research paper" prefix={<FileTextOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item name="author" label="Main Author" rules={[validationRules.required('main author')]}>
                            <Input placeholder="Full name of the primary author" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="co_author" label="Co-Author(s)">
                            <Input placeholder="Separate names with commas" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="abstract" label="Abstract / Executive Summary" rules={[validationRules.required('abstract')]}>
                    <TextArea rows={5} placeholder="Provide a concise summary of the research background, methodology, and key findings" />
                </Form.Item>

                <Divider orientation="left"><GlobalOutlined /> Classification & Metadata</Divider>
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item name="dept_id" label="Department" rules={[validationRules.required('department')]}>
                            <Select
                                placeholder="Select assigned department"
                                allowClear
                                options={departments.map(d => ({ label: d.name, value: d.id }))}
                                onChange={(val) => {
                                    setSelectedDeptId(val);
                                    form.setFieldValue('discipline', undefined);
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="discipline" label="Program / Program" rules={[validationRules.required('program')]}>
                            <Select
                                placeholder={selectedDeptId ? 'Select specific program' : 'Select a department first'}
                                allowClear
                                disabled={!selectedDeptId}
                                options={programs
                                    .filter(p => p.department_id === selectedDeptId)
                                    .map(p => ({ label: p.name, value: p.name }))
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item name="degree_type" label="Degree Type" rules={[validationRules.required('degree type')]}>
                            <Input placeholder="e.g. BSCS, BSIT, PhD in Education" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="doi" label="Digital Object Identifier (DOI)" rules={[validationRules.doi]}>
                            <Input placeholder="e.g. 10.1000/xyz123" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item name="submission_date" label="Submission Date" rules={[validationRules.required('submission date')]}>
                            <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="keywords" label="Search Keywords" rules={[validationRules.required('at least one keyword')]}>
                            <Select mode="tags" placeholder="Press enter to add tags" tokenSeparators={[',']} prefix={<TagsOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left"><FilePdfOutlined /> Document Upload</Divider>
                <Form.Item 
                    label="Thesis PDF Document" 
                    required={!editingId && !existingPdfName}
                    rules={!editingId && !existingPdfName ? [{ required: true, message: 'Please upload the thesis PDF' }] : []}
                >
                    <Upload.Dragger
                        name="pdf_file"
                        accept=".pdf"
                        multiple={false}
                        maxCount={1}
                        fileList={pdfFileList}
                        beforeUpload={(file) => {
                            const isLt50M = file.size / 1024 / 1024 < 50;
                            if (!isLt50M) {
                                notification.error({ message: 'File too large', description: 'PDF must be smaller than 50MB' });
                                return Upload.LIST_IGNORE;
                            }
                            return false;
                        }}
                        onChange={({ fileList }) => setPdfFileList(fileList)}
                        style={{ borderRadius: 12, padding: '24px 0' }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: primaryColor, fontSize: 48 }} />
                        </p>
                        <p className="ant-upload-text" style={{ fontWeight: 600, fontSize: 16 }}>Click or drag PDF file here</p>
                        <p className="ant-upload-hint">Only .pdf files up to 50MB are accepted for indexing</p>
                    </Upload.Dragger>
                    {existingPdfName && pdfFileList.length === 0 && (
                        <div style={{ marginTop: 12, padding: '12px 16px', border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, background: '#fafafa' }}>
                            <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                            <div style={{ flex: 1 }}>
                                <Text strong style={{ display: 'block', fontSize: 13 }}>{existingPdfName}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>Existing file — Only upload if you wish to replace it</Text>
                            </div>
                        </div>
                    )}
                </Form.Item>

                <div style={{ background: '#f9faff', padding: '16px 20px', borderRadius: 12, border: '1px solid #e6f7ff', marginBottom: 24 }}>
                    <Form.Item name="is_confidential" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch checkedChildren="Confidential Mode ON" unCheckedChildren="Publicly Accessible" />
                    </Form.Item>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                        Confidential documents are only visible to authorized personnel and the author.
                    </Text>
                </div>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item name="recommended_by" label="Recommended By">
                            <Input placeholder="Name of endorsing official" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="archived_by" label="Archived By">
                            <Input placeholder="Staff in-charge of archiving" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '32px 0 24px' }} />

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space size="middle">
                        <Button onClick={onCancel} size="large" style={{ minWidth: 120, borderRadius: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ minWidth: 160, borderRadius: 8, fontWeight: 600 }}>
                            {editingId ? 'Update Record' : 'Submit Archive'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default modalThesisForm;
