import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, App, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';
import { loginArg } from '../../private/api/auth';
import { handleFormErrors } from '../../utils/formUtils';

const { Title, Text } = Typography;

/* ───────────────────────────────────────────
   Keyframe style block injected once
─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@keyframes loginOrb1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(60px,-40px) scale(1.15); }
  66%      { transform: translate(-30px,50px) scale(0.9); }
}
@keyframes loginOrb2 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(-50px,60px) scale(1.1); }
  66%      { transform: translate(40px,-30px) scale(0.95); }
}
@keyframes loginOrb3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%      { transform: translate(30px,40px) scale(1.2); }
}
@keyframes loginCardIn {
  from { opacity: 0; transform: translateY(32px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes loginLogoSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes loginLogoPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
  50%      { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
}
@keyframes loginShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes loginBadgePulse {
  0%,100% { opacity: 0.7; }
  50%      { opacity: 1; }
}
@keyframes loginGridMove {
  from { background-position: 0 0; }
  to   { background-position: 64px 64px; }
}

.login-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Animated background grid */
.login-root::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  animation: loginGridMove 8s linear infinite;
  pointer-events: none;
  z-index: 0;
}

.login-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 92%;
  max-width: 440px;
  background: rgba(255,255,255,0.09);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.4),
    0 1px 0 rgba(255,255,255,0.12) inset;
  padding: clamp(24px, 7vw, 44px) clamp(16px, 5vw, 40px) clamp(20px, 5vw, 36px);
  animation: loginCardIn 0.6s cubic-bezier(.22,1,.36,1) both;
}

/* Input styling */
.login-card .ant-input-affix-wrapper {
  background: rgba(255,255,255,0.1) !important;
  border: 1.5px solid rgba(255,255,255,0.2) !important;
  border-radius: 12px !important;
  color: #fff !important;
  transition: border-color 0.25s, box-shadow 0.25s !important;
}
.login-card .ant-input-affix-wrapper:hover {
  border-color: rgba(255,255,255,0.45) !important;
}
.login-card .ant-input-affix-wrapper-focused,
.login-card .ant-input-affix-wrapper:focus-within {
  border-color: rgba(255,255,255,0.85) !important;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.15) !important;
}
.login-card .ant-input {
  background: transparent !important;
  color: #fff !important;
}
.login-card .ant-input::placeholder,
.login-card .ant-input-password input::placeholder {
  color: rgba(255,255,255,0.45) !important;
}
.login-card .ant-input-prefix,
.login-card .ant-input-suffix,
.login-card .anticon {
  color: rgba(255,255,255,0.7) !important;
}
.login-card .ant-form-item-label label {
  color: rgba(255,255,255,0.85) !important;
}
.login-card .ant-form-item-explain-error {
  color: #ff9494 !important;
}
.login-card .ant-checkbox-wrapper {
  color: rgba(255,255,255,0.75) !important;
}
.login-card .ant-checkbox-inner {
  background: rgba(255,255,255,0.1) !important;
  border-color: rgba(255,255,255,0.3) !important;
}

/* Shimmer button */
.login-btn {
  height: 50px !important;
  border-radius: 12px !important;
  border: none !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  background-size: 200% auto !important;
  animation: loginShimmer 3s linear infinite !important;
  transition: transform 0.15s, box-shadow 0.15s !important;
}
.login-btn:hover:not(:disabled) {
  transform: translateY(-1px) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important;
}
.login-btn:active:not(:disabled) {
  transform: translateY(0) !important;
}

.login-google-btn {
  height: 46px !important;
  border-radius: 12px !important;
  background: rgba(255,255,255,0.1) !important;
  border: 1.5px solid rgba(255,255,255,0.2) !important;
  color: #fff !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  transition: background 0.2s, border-color 0.2s !important;
}
.login-google-btn:hover {
  background: rgba(255,255,255,0.18) !important;
  border-color: rgba(255,255,255,0.4) !important;
  color: #fff !important;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  gap: 12px;
}
.login-divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.15);
}

.login-security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  animation: loginBadgePulse 3s ease-in-out infinite;
}

.login-logo-wrap {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: loginLogoPulse 2.5s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.login-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

@media (max-width: 576px) {
  .login-root {
    padding: 12px;
  }
  .login-card {
    border-radius: 20px;
    margin-bottom: 20px;
    width: 95%;
  }
  .login-logo-wrap {
    width: clamp(54px, 15vw, 68px);
    height: clamp(54px, 15vw, 68px);
    margin-bottom: clamp(12px, 4vw, 18px);
    border-radius: 16px;
  }
  .login-btn, .login-google-btn {
    height: 48px !important;
  }
  .login-divider {
    margin: clamp(12px, 4vw, 20px) 0;
  }
}

@media (max-height: 700px) and (orientation: portrait) {
  .login-root {
    align-items: flex-start;
    padding-top: 32px;
    overflow-y: auto;
  }
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
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { checkAuth, user, loading: authLoading } = useAuth();
    const { site_title, site_description, logo_path, primary_color, primary_color_dark } = useSystemConfig();

    const primaryColor  = primary_color  || '#2845D6';
    const primaryDark   = primary_color_dark || '#1A2CA3';
    const appName       = site_title     || 'THESIS ARCHIVE SYSTEM';
    const appDesc       = site_description || 'PHILIPPINE ELECTRONICS & COMMUNICATION INSTITUTE OF TECHNOLOGY';

    injectStyles();

    // Obfuscate / secure login URL visually
    useEffect(() => {
        if (!searchParams.has('_gl')) {
            const newParams = new URLSearchParams(searchParams);
            const r = (len) => Array.from({length: len}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
            
            // Format closely mimics the user's secure token pattern
            const token = `1*${r(6)}*_gcl_au*${btoa(Date.now().toString() + r(10)).replace(/=/g, '')}.*_ga*${r(32)}*_ga_${r(8).toUpperCase()}*${btoa(r(60)).replace(/=/g, '')}`;
            
            newParams.set('_gl', token);
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    // Redirect already-authenticated users away from login
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // Show error from URL params (e.g. Google OAuth fail)
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) message.error(error);
    }, [searchParams, message]);

    const getInitials = (name) =>
        name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const onFinish = async (values) => {
        if (submitted) return;
        setLoading(true);
        setSubmitted(true);
        try {
            await loginArg(values);
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
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${window.location.origin}/auth/google/redirect`;
    };

    // Don't render login page at all while we check if user is already authenticated
    if (authLoading) return null;

    // Gradient for shimmer button
    const btnGradient = `linear-gradient(90deg, ${primaryColor} 0%, ${primaryDark} 40%, ${primaryColor} 80%, ${primaryDark} 100%)`;

    return (
        <div
            className="login-root"
            style={{ background: `linear-gradient(135deg, ${primaryDark} 0%, #0a1045 50%, #0d0d2b 100%)` }}
        >
            {/* Animated orbs */}
            <div
                className="login-orb"
                style={{
                    width: 500, height: 500,
                    top: '-15%', right: '-10%',
                    background: `radial-gradient(circle, ${primaryColor}88 0%, transparent 70%)`,
                    animation: 'loginOrb1 14s ease-in-out infinite',
                }}
            />
            <div
                className="login-orb"
                style={{
                    width: 400, height: 400,
                    bottom: '-10%', left: '-8%',
                    background: `radial-gradient(circle, ${primaryDark}99 0%, transparent 70%)`,
                    animation: 'loginOrb2 18s ease-in-out infinite',
                }}
            />
            <div
                className="login-orb"
                style={{
                    width: 250, height: 250,
                    top: '55%', right: '20%',
                    background: 'radial-gradient(circle, rgba(246,128,72,0.35) 0%, transparent 70%)',
                    animation: 'loginOrb3 10s ease-in-out infinite',
                }}
            />

            <div className="login-card">
                {/* ── Logo + Branding ── */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div className="login-logo-wrap" style={{ background: logo_path ? 'rgba(255,255,255,0.15)' : primaryColor }}>
                        {logo_path ? (
                            <img src={logo_path} alt="System Logo" className="login-logo-img" />
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
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 'clamp(10px, 2.8vw, 12px)',
                            display: 'block',
                            marginTop: 6,
                            letterSpacing: '0.05em',
                            lineHeight: 1.5,
                            textTransform: 'uppercase',
                            maxWidth: '280px',
                            marginInline: 'auto'
                        }}
                    >
                        {appDesc}
                    </Text>

                    <div style={{
                        margin: '18px auto 0',
                        width: 40,
                        height: 3,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${primaryColor}, rgba(246,128,72,0.8))`,
                    }} />

                    <Text style={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        fontSize: 'clamp(13px, 3.8vw, 15px)', 
                        display: 'block', 
                        marginTop: 'clamp(12px, 4vw, 18px)',
                        fontWeight: 400
                    }}>
                        Sign in to access your archive
                    </Text>
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
                                    <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="rgba(255,255,255,0.7)" />
                                </svg>
                            }
                            placeholder="Email Address"
                            autoComplete="username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="rgba(255,255,255,0.7)" />
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
