import React, { useRef, useState, useEffect } from 'react';
import { Button, Space, Typography, theme } from 'antd';
import { ClearOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function SignaturePad({ value, onChange }) {
    const canvasRef = useRef(null);
    const { token } = theme.useToken();
    const isDrawingRef = useRef(false);
    const [isEmpty, setIsEmpty] = useState(true);

    // Store latest onChange callback in ref to avoid effect dependency issues
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Initialize canvas size and context correctly for high-DPI displays
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Setup resolution
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // Normalize context to use standard CSS pixels
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        
        // Re-draw initial value if provided and it's an image
        if (value && value.startsWith('data:image')) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
                setIsEmpty(false);
            };
            img.src = value;
        }

        const getCoordinates = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleStart = (e) => {
            e.preventDefault();
            const { x, y } = getCoordinates(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
            isDrawingRef.current = true;
        };

        const handleMove = (e) => {
            if (!isDrawingRef.current) return;
            e.preventDefault();
            const { x, y } = getCoordinates(e);
            ctx.lineTo(x, y);
            ctx.stroke();
            setIsEmpty(false);
        };

        const handleEnd = (e) => {
            if (!isDrawingRef.current) return;
            e.preventDefault();
            isDrawingRef.current = false;
            ctx.closePath();
            if (onChangeRef.current) {
                onChangeRef.current(canvas.toDataURL('image/png'));
            }
        };

        // Attach native events with passive: false for touch to prevent scrolling
        canvas.addEventListener('touchstart', handleStart, { passive: false });
        canvas.addEventListener('touchmove', handleMove, { passive: false });
        canvas.addEventListener('touchend', handleEnd, { passive: false });
        canvas.addEventListener('touchcancel', handleEnd, { passive: false });
        
        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('mouseout', handleEnd);

        return () => {
            canvas.removeEventListener('touchstart', handleStart);
            canvas.removeEventListener('touchmove', handleMove);
            canvas.removeEventListener('touchend', handleEnd);
            canvas.removeEventListener('touchcancel', handleEnd);
            canvas.removeEventListener('mousedown', handleStart);
            canvas.removeEventListener('mousemove', handleMove);
            canvas.removeEventListener('mouseup', handleEnd);
            canvas.removeEventListener('mouseout', handleEnd);
        };
    }, []);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        if (onChange) {
            onChange(null);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div 
                style={{ 
                    border: `1px dashed ${isEmpty ? token.colorBorder : token.colorPrimary}`, 
                    borderRadius: 8, 
                    background: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ 
                        width: '100%', 
                        height: 160, 
                        touchAction: 'none', 
                        cursor: 'crosshair',
                        display: 'block'
                    }}
                />
                
                {isEmpty && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', textAlign: 'center' }}>
                        <Text type="secondary" style={{ display: 'block' }}>Sign here using your mouse or finger</Text>
                    </div>
                )}
                
                {!isEmpty && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, pointerEvents: 'none' }}>
                        <CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: 18 }} />
                    </div>
                )}
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    type="text" 
                    size="small" 
                    icon={<ClearOutlined />} 
                    disabled={isEmpty} 
                    onClick={clearSignature}
                    danger
                >
                    Clear Signature
                </Button>
            </div>
        </div>
    );
}
