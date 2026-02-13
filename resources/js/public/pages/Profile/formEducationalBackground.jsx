import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Space, Row, Col, message } from 'antd';
import { Save } from 'lucide-react';
import dayjs from 'dayjs';
import { addEducation, updateEducation } from '../../../private/api/profile';

const { TextArea } = Input;
const { Option } = Select;

export default function EducationalBackgroundForm({ initialValues, onCancel, onSuccess }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                year_start: initialValues.year_start ? dayjs(`${initialValues.year_start}-01-01`) : null,
                year_end: initialValues.year_end ? dayjs(`${initialValues.year_end}-01-01`) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedValues = {
                ...values,
                year_start: values.year_start ? values.year_start.year() : null,
                year_end: values.year_end ? values.year_end.year() : null,
            };

            if (initialValues) {
                await updateEducation(initialValues.id, formattedValues);
                message.success('Education updated successfully');
            } else {
                await addEducation(formattedValues);
                message.success('Education added successfully');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            message.error('Failed to save education');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
        >
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[{ required: true, message: 'Please select level' }]}
                    >
                        <Select placeholder="Select level">
                            <Option value="Primary">Primary</Option>
                            <Option value="Secondary">Secondary</Option>
                            <Option value="Tertiary">Tertiary</Option>
                            <Option value="Vocational">Vocational</Option>
                            <Option value="Master's Degree">Master's Degree</Option>
                            <Option value="Doctorate Degree">Doctorate Degree</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="degree"
                        label="Degree / Initials (e.g. BSCS, Dr.)"
                    >
                        <Input placeholder="Degree or Initials" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="school_name"
                label="School Name"
                rules={[{ required: true, message: 'Please enter school name' }]}
            >
                <Input placeholder="Enter school name" />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="year_start"
                        label="Start Year"
                        rules={[{ required: true, message: 'Please select start year' }]}
                    >
                        <DatePicker picker="year" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="year_end"
                        label="End Year"
                    >
                        <DatePicker picker="year" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label="Description / Honors"
            >
                <TextArea rows={3} placeholder="Additional details..." />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" icon={<Save size={16} />} loading={loading}>
                        Save Changes
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}
