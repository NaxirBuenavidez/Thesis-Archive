import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

export default function modalDept({ open, onCancel, onFinish, submitLoading, initialValues }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (initialValues) {
                form.setFieldsValue({
                    name: initialValues.name,
                });
            }
        }
    }, [open, initialValues, form]);

    return (
        <Modal
            title={initialValues ? "Edit Department" : "Add New Department"}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Department Name"
                    rules={[{ required: true, message: 'Please enter department name' }]}
                >
                    <Input placeholder="e.g. College of Computer Studies" />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                    <Space>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitLoading}>
                            {initialValues ? "Update" : "Create"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
