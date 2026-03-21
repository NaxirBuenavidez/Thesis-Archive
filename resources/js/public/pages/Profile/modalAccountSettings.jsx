import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Typography, Row, Col, Divider, theme, App } from 'antd';
import { Lock, User } from 'lucide-react';
import { updateAccount, verifyPassword } from '../../../private/api/profile';
import { handleFormErrors } from '../../../utils/formUtils';

const { Title, Text } = Typography;

export default function AccountSettingsModal({ open, onCancel, user, checkAuth }) {
    const { message } = App.useApp();
    const [accountForm] = Form.useForm();
    const [accountLoading, setAccountLoading] = useState(false);

    // Verification State
    const [isVerified, setIsVerified] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);

    const { token } = theme.useToken();
    const { colorPrimary } = token;

    useEffect(() => {
        if (open) {
            // Reset state when modal opens
            setIsVerified(false);
            accountForm.resetFields();
            if (user) {
                accountForm.setFieldsValue({
                    email: user.email,
                });
            }
        }
    }, [open, user, accountForm]);

    const handleVerification = async (values) => {
        setVerificationLoading(true);
        try {
            await verifyPassword(values.password);
            message.success('Password verified');
            setIsVerified(true);
            accountForm.setFieldValue('current_password', values.password);
        } catch (error) {
            console.error(error);
            message.error('Incorrect password');
        } finally {
            setVerificationLoading(false);
        }
    };

    const onAccountFinish = async (values) => {
        setAccountLoading(true);
        try {
            await updateAccount(values);
            message.success('Account settings updated successfully');
            checkAuth();
            onCancel(); // Close modal on success
        } catch (error) {
            if (!handleFormErrors(error, accountForm)) {
                message.error('Failed to update account settings');
            }
        } finally {
            setAccountLoading(false);
        }
    };

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={isVerified ? 600 : 400}
            style={{ maxWidth: 'calc(100vw - 32px)' }}
            centered
        >
            {!isVerified ? (
                <div style={{ padding: '24px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Lock size={48} color={colorPrimary} />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Title level={4} style={{ marginBottom: 16 }}>Security Verification</Title>
                        <Text type="secondary" style={{ display: 'block' }}>
                            Please enter your password to access account settings.
                        </Text>
                    </div>
                    <Form
                        layout="vertical"
                        onFinish={handleVerification}
                        size="large"
                    >
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password placeholder="Enter your password" prefix={<Lock size={16} />} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={verificationLoading} block>
                            Verify & Continue
                        </Button>
                    </Form>
                </div>
            ) : (
                <div>
                    <div style={{ marginBottom: 24, textAlign: 'center' }}>
                        <Title level={4} style={{ margin: 0 }}>Account Settings</Title>
                        <Text type="secondary">Update your email and password</Text>
                    </div>
                    <Form
                        form={accountForm}
                        layout="vertical"
                        onFinish={onAccountFinish}
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input prefix={<User size={16} color="rgba(0,0,0,.25)" />} placeholder="Email Address" />
                        </Form.Item>

                        <Divider dashed orientation="left">Change Password</Divider>

                        {/* Hidden current password field, populated after verification */}
                        <Form.Item
                            name="current_password"
                            hidden
                            style={{ display: 'none' }}
                        >
                            <Input />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="password"
                                    label="New Password"
                                    rules={[{ min: 8, message: 'Password must be at least 8 characters' }]}
                                >
                                    <Input.Password placeholder="New Password" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="password_confirmation"
                                    label="Confirm New Password"
                                    dependencies={['password']}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm New Password" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Button onClick={onCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={accountLoading}
                            >
                                Update Account
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Modal>
    );
}
