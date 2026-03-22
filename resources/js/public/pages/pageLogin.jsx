import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, App, Typography } from 'antd';
import ReCAPTCHA from "react-google-recaptcha";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';
import { loginArg } from '../../private/api/auth';
import { handleFormErrors } from '../../utils/formUtils';

const { Title, Text } = Typography;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@keyframes loginCardIn {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes loginShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.login-root {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  position: relative;
  overflow: hidden;
  background: #f8fafc; /* Clean light background */
  margin: 0;
  padding: 24px;
}

#tsparticles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  background: var(--login-theme-bg, #1a2ca3); /* Primary color fallback */
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  padding: 44px 40px;
  animation: loginCardIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  color: #fff;
}

/* Mobile specific: Proportional layout */
@media (max-width: 576px) {
  .login-root {
    align-items: center; /* Center instead of end to avoid stretch */
    padding: 20px;
  }
  .login-card {
    max-width: 400px; /* Keep it compact on mobile too */
    border-radius: 28px;
    padding: 40px 24px;
    max-height: 90vh;
    overflow-y: auto;
    animation: loginCardIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

@keyframes mobileSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Input styling enhancement */
.login-card .ant-input-affix-wrapper {
  background: #fff !important;
  border: 1.5px solid rgba(0,0,0,0.1) !important;
  border-radius: 14px !important;
  color: #000 !important;
  height: 52px !important;
  padding: 4px 16px !important;
}
.login-card .ant-input-affix-wrapper input {
  color: #000 !important;
}
.login-card .ant-input-affix-wrapper:hover, .login-card .ant-input-affix-wrapper-focused {
  border-color: var(--login-theme-color, #1a2ca3) !important;
  background: #fff !important;
}
.login-card .ant-input-placeholder {
  color: rgba(0,0,0,0.45) !important;
}

/* Button enhancement */
.login-btn {
  height: 54px !important;
  border-radius: 14px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
  background: #fff !important;
  color: var(--login-theme-color, #1a2ca3) !important;
}
.login-btn:hover {
  transform: scale(1.01) !important;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important;
  opacity: 0.9 !important;
}

.login-google-btn {
  height: 52px !important;
  border-radius: 14px !important;
  background: #fff !important;
  border: 1.5px solid rgba(0,0,0,0.1) !important;
  color: #000 !important;
}

.login-logo-wrap {
  width: 80px;
  height: 80px;
  border-radius: 22px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.login-captcha {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
}

.login-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}
`;

/* Inject styles into <head> once */
let styleInjected = false;
function injectStyles() {
    if (styleInjected) return;
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    styleInjected = true;
}

export default function Login() {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const recaptchaRef = React.useRef();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { checkAuth, user, loading: authLoading } = useAuth();
    const { site_title, site_description, logo_path, primary_color, primary_color_dark } = useSystemConfig();

    const primaryColor = primary_color || '#2845D6';
    const primaryDark = primary_color_dark || '#1A2CA3';
    const appName = site_title || 'THESIS ARCHIVE SYSTEM';
    const appDesc = site_description || 'PHILIPPINE ELECTRONICS & COMMUNICATION INSTITUTE OF TECHNOLOGY';

    injectStyles();

    // Check for error from URL params (e.g. Google OAuth fail)
    const hasError = searchParams.has('error');

    // Show error from URL params (e.g. Google OAuth fail)


    useEffect(() => {
        if (hasError) {
            const errorMsg = searchParams.get('error');
            if (errorMsg) {
                console.warn('[LOGIN] Authentication error detected:', errorMsg);
                message.error(errorMsg);
            }
        }
    }, [hasError, message]);

    const getInitials = (name) =>
        name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const onFinish = async (values) => {
        if (submitted) return;
        const token = recaptchaRef.current.getValue();
        if (!token) {
            message.error('Please complete the security verification');
            setLoading(false);
            setSubmitted(false);
            return;
        }

        try {
            await loginArg({ ...values, captcha_token: token });
            message.success('Login successful');
            await checkAuth();
            navigate('/');
        } catch (error) {
            if (!handleFormErrors(error, form)) {
                if (error.response?.status === 429) {
                    message.error('Too many login attempts. Please wait a minute before trying again.');
                } else if (error.response?.data?.message) {
                    message.error(error.response.data.message);
                } else if (error.response?.data?.errors?.email) {
                    message.error('Invalid email or password. Please try again.');
                } else {
                    message.error('Login failed. Please check your credentials and try again.');
                }
            }
            setSubmitted(false);
        } finally {
            setLoading(false);
            if (!submitted) recaptchaRef.current.reset();
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${window.location.origin}/auth/google/redirect`;
    };

    // Don't render login page at all while we check if user is already authenticated
    if (authLoading) return null;

    // Gradient for shimmer button
    const btnGradient = `linear-gradient(90deg, ${primaryColor} 0%, ${primaryDark} 40%, ${primaryColor} 80%, ${primaryDark} 100%)`;

    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesInit = async (main) => {
        // No-op, handled by initParticlesEngine
    };

    const particlesConfig = {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
            },
        },
        particles: {
            color: { value: primaryColor },
            links: {
                color: primaryColor,
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 80,
            },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
        },
        detectRetina: true,
    };

    return (
        <div
            className="login-root"
            style={{ 
                '--login-theme-bg': primaryColor,
                '--login-theme-color': primaryColor
            }}
        >
            {init && (
                <Particles
                    id="tsparticles"
                    options={particlesConfig}
                />
            )}

            <div className="login-card">
                {/* ── Logo + Branding ── */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div className="login-logo-wrap" style={{ background: (logo_path && logo_path.includes('/')) ? 'rgba(255,255,255,0.15)' : primaryColor }}>
                        {(logo_path && logo_path.includes('/')) ? (
                            <img
                                src={logo_path}
                                alt={appName}
                                className="login-logo-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span style="color: #fff; font-size: 26px; font-weight: 800; letter-spacing: -1px;">${getInitials(appName)}</span>`;
                                }}
                            />
                        ) : (
                            <span style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>
                                {getInitials(appName)}
                            </span>
                        )}
                    </div>

                    <Title
                        level={4}
                        style={{
                            color: '#fff',
                            margin: 0,
                            fontWeight: 800,
                            fontSize: 'clamp(16px, 5vw, 22px)',
                            letterSpacing: 'min(0.05em, 1.5px)',
                            lineHeight: 1.2,
                            textTransform: 'uppercase',
                        }}
                    >
                        {appName}
                    </Title>
                </div>

                {/* ── Form ── */}
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email address' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input
                            prefix={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                                    <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="rgba(0,0,0,0.45)" />
                                </svg>
                            }
                            placeholder="Email Address"
                            autoComplete="email"
                            inputMode="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="rgba(0,0,0,0.45)" />
                                </svg>
                            }
                            placeholder="Password"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a
                                href="#"
                                style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}
                                onClick={e => e.preventDefault()}
                            >
                                Forgot password?
                            </a>
                        </div>
                    </Form.Item>

                    {/* CAPTCHA Widget */}
                    <Form.Item name="captcha_token" style={{ marginBottom: 20 }}>
                        <div className="login-captcha">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                                theme="dark"
                                onChange={(val) => form.setFieldsValue({ captcha_token: val })}
                            />
                        </div>
                        {/* 
                          Note: If you see "Invalid key type", verify that your VITE_CAPTCHA_SITE_KEY 
                          is for reCAPTCHA v2 (Checkbox), not v3.
                        */}
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={submitted && loading}
                            block
                            className="login-btn"
                            style={{ background: btnGradient }}
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </Form.Item>

                    {/* Google Sign-in */}
                    <div className="login-divider">
                        <div className="login-divider-line" />
                        <Text style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: 'clamp(10px, 3vw, 12px)',
                            whiteSpace: 'nowrap'
                        }}>
                            OR CONTINUE WITH
                        </Text>
                        <div className="login-divider-line" />
                    </div>

                    <Button
                        block
                        className="login-google-btn"
                        onClick={handleGoogleLogin}
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        }
                    >
                        Sign in with Google
                    </Button>
                </Form>

                {/* ── Footer ── */}
                <div className="login-security-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="rgba(255,255,255,0.5)" />
                        <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="rgba(255,255,255,0.9)" />
                    </svg>
                    <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                        Secured Connection · SSL Protected
                    </Text>
                </div>

                <div style={{ textAlign: 'center', marginTop: 'clamp(10px, 4vw, 16px)' }}>
                    <Text style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: 'clamp(11px, 3.2vw, 12px)'
                    }}>
                        Don't have an account?{' '}
                    </Text>
                    <a
                        href="#"
                        style={{
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: 'clamp(11px, 3.2vw, 12px)',
                            fontWeight: 600
                        }}
                        onClick={e => e.preventDefault()}
                    >
                        Contact Administrator
                    </a>
                </div>
            </div>
        </div>
    );
}
