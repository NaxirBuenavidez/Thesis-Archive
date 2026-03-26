import React, { useState, useEffect, useRef } from 'react';
import { useSystemConfig } from '../../context/SystemConfigContext';
import { theme } from 'antd';

const { useToken } = theme;

export default function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const { token } = useToken();
    const { logo_path, primary_color } = useSystemConfig();
    const color = primary_color || token.colorPrimary || '#2845D6';

    // Use a counter so nested calls don't flicker
    const countRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        const handleStart = () => {
            countRef.current += 1;
            if (countRef.current === 1) {
                clearTimeout(timerRef.current);
                setIsLoading(true);
                // 250ms delay before showing to avoid flicker on fast responses
                timerRef.current = setTimeout(() => setVisible(true), 250);
            }
        };

        const handleStop = () => {
            countRef.current = Math.max(0, countRef.current - 1);
            if (countRef.current === 0) {
                // CLEAR the start timer if it hasn't fired yet!
                if (timerRef.current) clearTimeout(timerRef.current);

                if (visible) {
                    setVisible(false);
                    timerRef.current = setTimeout(() => setIsLoading(false), 120); // Faster fade out
                } else {
                    setIsLoading(false); // Never showed, so reset immediately
                }
            }
        };

        // Safety resets: clear loader on navigation / visibility change / focus
        const handleReset = () => {
            countRef.current = 0;
            setVisible(false);
            setIsLoading(false);
            if (timerRef.current) clearTimeout(timerRef.current);
        };

        window.addEventListener('loading-start', handleStart);
        window.addEventListener('loading-stop', handleStop);
        window.addEventListener('pageshow', handleReset);
        window.addEventListener('popstate', handleReset);
        window.addEventListener('visibilitychange', () => {
            if (document.hidden) handleReset();
        });
        window.addEventListener('focus', handleReset); // Often helps on mobile resume

        return () => {
            window.removeEventListener('loading-start', handleStart);
            window.removeEventListener('loading-stop', handleStop);
            window.removeEventListener('pageshow', handleReset);
            window.removeEventListener('popstate', handleReset);
            window.removeEventListener('focus', handleReset);
            clearTimeout(timerRef.current);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <>
            <style>{`
                @keyframes gl-spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes gl-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%      { transform: scale(0.92); opacity: 0.8; }
                }
                @keyframes gl-fadein {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .gl-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.72);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    transition: opacity 0.18s ease;
                    animation: gl-fadein 0.12s ease;
                }
                .gl-ring {
                    position: relative;
                    width: 140px;
                    height: 140px;
                }
                .gl-ring::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 5px solid rgba(0,0,0,0.07);
                }
                .gl-arc {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 5px solid transparent;
                    border-top-color: var(--gl-color);
                    border-right-color: var(--gl-color);
                    animation: gl-spin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
                }
                .gl-arc2 {
                    inset: 12px;
                    border-top-color: transparent;
                    border-right-color: transparent;
                    border-bottom-color: var(--gl-color);
                    border-left-color: var(--gl-color);
                    opacity: 0.45;
                    animation: gl-spin 1.4s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite reverse;
                }
                .gl-logo {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: gl-pulse 1.8s ease-in-out infinite;
                }
                .gl-logo img {
                    width: 64px;
                    height: 64px;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .gl-fallback {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 18px;
                    color: #fff;
                    letter-spacing: -1px;
                    user-select: none;
                }
            `}</style>

            <div
                className="gl-overlay"
                style={{ opacity: visible ? 1 : 0, '--gl-color': color }}
            >
                <div className="gl-ring">
                    <div className="gl-arc" />
                    <div className="gl-arc gl-arc2" />
                    <div className="gl-logo">
                        {logo_path ? (
                            <img src={logo_path} alt="System Logo" />
                        ) : (
                            <div className="gl-fallback" style={{ background: color }}>
                                {(site_title || 'PTAS').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
