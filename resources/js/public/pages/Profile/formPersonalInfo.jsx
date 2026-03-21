import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Row, Col, Space, Button, Divider, Select, Card, App } from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { updateProfile } from '../../../private/api/profile';

const { TextArea } = Input;
const { Option } = Select;

export default function PersonalInfoForm({ user, checkAuth, onCancel, onSuccess }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Initial value setting
    useEffect(() => {
        if (user && user.profile) {
            form.setFieldsValue({
                ...user.profile,
                date_of_birth: user.profile.date_of_birth ? dayjs(user.profile.date_of_birth) : null,
                educational_backgrounds: user.educational_backgrounds ? user.educational_backgrounds.map(edu => ({
                    ...edu,
                    year_start: edu.year_start ? dayjs(`${edu.year_start}-01-01`) : null,
                    year_end: edu.year_end ? dayjs(`${edu.year_end}-01-01`) : null,
                })) : []
            });
        }
    }, [user, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedValues = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
                educational_backgrounds: values.educational_backgrounds ? values.educational_backgrounds.map(edu => ({
                    ...edu,
                    year_start: edu.year_start ? edu.year_start.year() : null,
                    year_end: edu.year_end ? edu.year_end.year() : null,
                })) : []
            };
            await updateProfile(formattedValues);
            message.success('Profile updated successfully');
            await checkAuth(); // Refresh user data
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            message.error('Failed to update profile');
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
            autoComplete="off"
        >
            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="fname"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                        <Input placeholder="Enter your first name" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="mname"
                        label="Middle Name"
                    >
                        <Input placeholder="Enter your middle name" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="lname"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                        <Input placeholder="Enter your last name" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="suffix"
                        label="Suffix"
                    >
                        <Input placeholder="e.g. Jr., Sr., III" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="date_of_birth"
                        label="Date of Birth"
                    >
                        <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="address"
                label="Address"
            >
                <TextArea rows={3} placeholder="Enter your complete address" style={{ resize: 'none' }} />
            </Form.Item>

            <Form.Item
                name="bio"
                label="Bio"
            >
                <TextArea rows={4} placeholder="Write something about yourself..." style={{ resize: 'none' }} />
            </Form.Item>

            <Divider orientation="left">Educational Attainment</Divider>

            <Form.List name="educational_backgrounds">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card
                                key={key}
                                size="small"
                                style={{ marginBottom: 16, backgroundColor: '#fafafa' }}
                                extra={
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                                    />
                                }
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'level']}
                                            label="Level"
                                            rules={[{ required: true, message: 'Missing level' }]}
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
                                            {...restField}
                                            name={[name, 'degree']}
                                            label="Degree / Initials"
                                        >
                                            <Input placeholder="e.g. BSCS, Dr." />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'school_name']}
                                    label="School Name"
                                    rules={[{ required: true, message: 'Missing school name' }]}
                                >
                                    <Input placeholder="Enter school name" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'year_start']}
                                            label="Start Year"
                                            rules={[{ required: true, message: 'Missing start year' }]}
                                        >
                                            <DatePicker picker="year" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'year_end']}
                                            label="End Year"
                                        >
                                            <DatePicker picker="year" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'description']}
                                    label="Description / Honors"
                                >
                                    <TextArea rows={2} placeholder="Additional details..." />
                                </Form.Item>

                                {/* Hidden ID field to track updates */}
                                <Form.Item
                                    {...restField}
                                    name={[name, 'id']}
                                    hidden
                                >
                                    <Input />
                                </Form.Item>
                            </Card>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Education
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Divider />

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loading}
                    >
                        Save Changes
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}
