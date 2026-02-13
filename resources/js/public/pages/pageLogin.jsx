import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, App, theme, Typography, Card, Layout } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginArg } from '../../private/api/auth';

const { Title, Text } = Typography;
const { useToken } = theme;

export default function Login() {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { checkAuth } = useAuth(); // Destructure checkAuth from useAuth
    const { token } = useToken();

    // Use system theme colors or fallbacks
    const primaryColor = import.meta.env.VITE_COLOR_PRIMARY || '#2845D6';
    const accentColor = import.meta.env.VITE_COLOR_ACCENT || '#F68048';


    // ... inside component
    const onFinish = async (values) => {
        setLoading(true);
        try {
            await loginArg(values);
            message.success('Login successful');
            await checkAuth(); // Re-fetch user state
            navigate('/'); // Navigate to dashboard
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            message.error(error);
        }
    }, [searchParams, message]);

    const handleGoogleLogin = () => {
        window.location.href = `${window.location.origin}/auth/google/redirect`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${primaryColor} 0%, #0f1c6e 100%)`,
            padding: '20px'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 450,
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)'
                }}
                styles={{ body: { padding: '40px 30px' } }}
            >
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        background: primaryColor,
                        borderRadius: '12px',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 'bold'
                    }}>
                        TA
                    </div>
                    <Title level={3} style={{ margin: 0, color: '#333' }}>Welcome Back</Title>
                    <Text type="secondary">Please sign in to your account</Text>
                </div>

                <Form
                    name="login_form"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" style={{ color: primaryColor }} />}
                            placeholder="Email Address"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" style={{ color: primaryColor }} />}
                            type="password"
                            placeholder="Password"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a className="login-form-forgot" href="" style={{ color: primaryColor }}>
                                Forgot password?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={loading}
                            block
                            style={{
                                height: '45px',
                                borderRadius: '8px',
                                background: primaryColor,
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                boxShadow: '0 4px 14px 0 rgba(40, 69, 214, 0.39)'
                            }}
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                        <Text type="secondary" style={{ padding: '0 10px' }}>OR</Text>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                    </div>

                    <Button
                        block
                        icon={<GoogleOutlined />}
                        onClick={handleGoogleLogin}
                        style={{
                            height: '45px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        Sign in with Google
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary">Don't have an account? </Text>
                    <a href="" style={{ color: accentColor, fontWeight: 500 }}>Contact Administrator</a>
                </div>
            </Card>
        </div>
    );
}
