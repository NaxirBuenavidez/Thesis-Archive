import React from 'react';
import { ScaleLoader } from 'react-spinners';
import { useLoading } from '../../context/LoadingContext';
import { theme } from 'antd';
const { useToken } = theme;

export default function GlobalLoader() {
    const { isLoading } = useLoading();
    const { token } = useToken();
    const primaryColor = token.colorPrimary;

    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(2px)'
        }}>
            <ScaleLoader color={primaryColor} height={50} width={6} radius={4} margin={4} />
        </div>
    );
}
