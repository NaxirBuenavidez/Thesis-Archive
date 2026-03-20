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
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            transition: 'opacity 0.2s',
        }}>
            <ScaleLoader color={primaryColor} height={44} width={5} radius={4} margin={3} />
        </div>
    );
}
