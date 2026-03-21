import React from 'react';
import { Modal, Form, Input, Row, Col, Select, DatePicker, Upload, Switch, Divider, Space, Button, Typography } from 'antd';
import { FileTextOutlined, InboxOutlined, FilePdfOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const modalThesisForm = ({ 
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
            width={isMobile ? '100%' : 800}
            style={{ maxWidth: 'calc(100vw - 32px)', top: isMobile ? 0 : undefined, margin: isMobile ? 0 : undefined, padding: isMobile ? 0 : undefined }}
            styles={{ body: { maxHeight: isMobile ? '90vh' : undefined, overflowY: isMobile ? 'auto' : undefined } }}
            destroyOnHidden
        >
            <div style={{ padding: '24px 0' }}>
                <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item name="title" label="Thesis Title" rules={[{ required: true, message: 'Please enter the title' }]}>
                                <Input placeholder="Enter main title" prefix={<FileTextOutlined style={{ fontSize: 18, color: 'rgba(0,0,0,.25)' }} />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="author" label="Main Author" rules={[{ required: true, message: 'Please enter the main author name' }]}>
                                <Input placeholder="Enter full name of author" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="co_author" label="Co-Author(s) (Optional)">
                                <Input placeholder="Enter co-author(s) names" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="panelists" label="Panelists (Optional)">
                                <Input placeholder="Enter panelist names" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="subtitle" label="Subtitle (Optional)">
                                <Input placeholder="Enter subtitle or alternative title" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="abstract" label="Abstract">
                        <TextArea rows={4} placeholder="Enter thesis abstract or executive summary" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="dept_id" label="Department">
                                <Select
                                    placeholder="Select department"
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
                            <Form.Item name="discipline" label="Program / Discipline">
                                <Select
                                    placeholder={selectedDeptId ? 'Select program' : 'Select a department first'}
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

                    <Form.Item name="keywords" label="Keywords">
                        <Select mode="tags" placeholder="Type and press enter to add keywords" tokenSeparators={[',']} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="degree_type" label="Degree Type">
                                <Input placeholder="e.g. MSc, PhD, BSCS" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="doi" label="DOI (Optional)">
                                <Input placeholder="e.g. 10.1000/xyz123" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="submission_date" label="Submission Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Upload PDF Document">
                        <Upload.Dragger
                            name="pdf_file"
                            accept=".pdf"
                            multiple={false}
                            maxCount={1}
                            fileList={pdfFileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setPdfFileList(fileList)}
                            style={{ borderRadius: 8 }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: primaryColor, fontSize: 32 }} />
                            </p>
                            <p className="ant-upload-text" style={{ fontWeight: 600 }}>Click or drag PDF file here</p>
                            <p className="ant-upload-hint">Only .pdf files up to 50MB are accepted</p>
                        </Upload.Dragger>
                        {existingPdfName && pdfFileList.length === 0 && (
                            <div style={{ marginTop: 8, padding: '8px 12px', background: '#f5f5f5', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FilePdfOutlined style={{ color: 'red' }} />
                                <Text style={{ fontSize: 13 }}>{existingPdfName}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>(existing file — upload a new one to replace)</Text>
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item name="is_confidential" valuePropName="checked">
                        <Switch checkedChildren="Confidential Document" unCheckedChildren="Public Document" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="recommended_by" label="Recommended By (Optional)">
                                <Input placeholder="Enter recommender's name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="archived_by" label="Archived By (Optional)">
                                <Input placeholder="Enter archiver's name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ margin: '24px 0' }} />

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={onCancel} size="large">Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading} size="large">
                                {editingId ? 'Update Thesis' : 'Archive Thesis'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default modalThesisForm;
