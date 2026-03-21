import React, { useState, useEffect, useRef } from 'react';
import { Badge, Popover, Typography, Button, Spin, Empty, theme, Drawer, notification, ConfigProvider } from 'antd';
import { AlertFilled, AlertUrgentFilled } from '@fluentui/react-icons';
import { CustomNotification } from './UI/SystemNotifications';

const { Text } = Typography;

export default function NotificationBell({ isMobile, onClickMobile }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    // Add local clearance time to hide older loaded notifications
    const [clearedAt, setClearedAt] = useState(() => localStorage.getItem('notifications_cleared_at') || null);
    
    // Track previous latest notification ID
    const [latestId, setLatestId] = useState(null);
    
    // Refs for performance and realtime optimizations
    const timeoutRef = useRef(null);
    const abortControllerRef = useRef(null);
    const errorCountRef = useRef(0);
    
    const { token } = theme.useToken();

    const fetchNotifications = async (initialLoad = false) => {
        try {
            // Cancel previous pending request to prevent fetch race conditions
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            if (initialLoad) setLoading(true);
            
            const { data } = await window.axios.get('/api/notifications', {
                signal: abortControllerRef.current.signal
            });
            
            errorCountRef.current = 0; // Reset error backoff on success
            
            // Apply localized clearing (hide any notification created before `clearedAt`)
            const visibleNotifications = data.notifications.filter(n => {
                if (!clearedAt) return true;
                return new Date(n.created_at).getTime() > new Date(clearedAt).getTime();
            });
            
            setNotifications(visibleNotifications);
            setUnreadCount(visibleNotifications.filter(n => !n.read_at).length);
            
            // Check for new notifications to pop a warning!
            const newLatest = data.notifications.length > 0 ? data.notifications[0].id : null;
            if (!initialLoad && latestId && newLatest && newLatest > latestId) {
                // Determine how many new
                notification.open({
                    message: <Text strong style={{ color: '#ff4d4f' }}>New Alert</Text>,
                    description: data.notifications[0].title,
                    icon: <AlertUrgentFilled style={{ color: '#ff4d4f', fontSize: 24 }} />,
                    placement: 'topLeft',
                    style: { borderLeft: '4px solid #ff4d4f' }
                });
            }
            if (newLatest && newLatest > (latestId || 0)) {
                setLatestId(newLatest);
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
                console.error('Failed to fetch notifications:', error);
                errorCountRef.current += 1;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isSubscribed = true;

        const loop = async () => {
            if (!isSubscribed) return;

            // Only fetch if document is visible (saves massive bandwidth/DB load)
            if (document.visibilityState === 'visible') {
                await fetchNotifications(false);
            }
            
            // Exponential backoff logic
            let delay = 60000; // default 1m
            if (errorCountRef.current > 0) {
                 delay = Math.min(60000 * Math.pow(2, errorCountRef.current), 300000); // Max 5m
            }
            
            if (isSubscribed) {
                timeoutRef.current = setTimeout(loop, delay);
            }
        };

        // Initial fetch logic: skip if already in bootData
        if (window.__boot_data && window.__boot_data.notifications) {
            const data = window.__boot_data.notifications;
            const visibleNotifications = data.filter(n => {
                if (!clearedAt) return true;
                return new Date(n.created_at).getTime() > new Date(clearedAt).getTime();
            });
            setNotifications(visibleNotifications);
            setUnreadCount(visibleNotifications.filter(n => !n.read_at).length);
            const newLatest = data.length > 0 ? data[0].id : null;
            if (newLatest) setLatestId(newLatest);
            
            // Start the loop after the standard delay
            if (isSubscribed) {
                timeoutRef.current = setTimeout(loop, 60000);
            }
        } else {
            // Initial fetch
            fetchNotifications(true).then(() => {
                if (isSubscribed) {
                    timeoutRef.current = setTimeout(loop, 60000);
                }
            });
        }

        // Focus listener for real-time feel
        const handleFocus = () => {
            if (document.visibilityState === 'visible') {
                // If they focus back, fetch immediately!
                clearTimeout(timeoutRef.current);
                fetchNotifications(false).then(() => {
                    if (isSubscribed) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(loop, 60000);
                    }
                });
            }
        };

        window.addEventListener('visibilitychange', handleFocus);
        window.addEventListener('focus', handleFocus);

        return () => {
            isSubscribed = false;
            clearTimeout(timeoutRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
            window.removeEventListener('visibilitychange', handleFocus);
            window.removeEventListener('focus', handleFocus);
        };
    }, [clearedAt]);

    const handleClearLoaded = () => {
        const now = new Date().toISOString();
        localStorage.setItem('notifications_cleared_at', now);
        setClearedAt(now);
        setNotifications([]);
        setUnreadCount(0);
        setPopoverOpen(false);
        setDrawerOpen(false);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await window.axios.post('/api/notifications/mark-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            CustomNotification.success('All notifications marked as read');
        } catch (error) {
            CustomNotification.error('Failed to mark notifications');
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await window.axios.post(`/api/notifications/${id}/mark-read`);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const content = (
        <div style={{ width: 320, maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                <Text strong>System Alerts</Text>
                <div>
                    <Button type="link" size="small" onClick={handleClearLoaded} style={{ color: token.colorTextSecondary }}>
                        Clear
                    </Button>
                    {unreadCount > 0 && (
                        <Button type="link" size="small" onClick={handleMarkAllAsRead}>
                            Read All
                        </Button>
                    )}
                </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8, paddingRight: 4 }}>
                {loading && notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>
                ) : notifications.length === 0 ? (
                    <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {notifications.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '12px 14px',
                                    border: `1px solid ${item.read_at ? token.colorBorderSecondary : 'rgba(255, 77, 79, 0.2)'}`,
                                    backgroundColor: item.read_at ? token.colorBgContainer : 'rgba(255, 77, 79, 0.04)',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onClick={() => {
                                    if (!item.read_at) handleMarkAsRead(item.id);
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                    <Text strong={!item.read_at} style={{ fontSize: 13, lineHeight: 1.3 }}>{item.title}</Text>
                                    {!item.read_at && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff4d4f', marginTop: 4, flexShrink: 0, marginLeft: 8 }} />}
                                </div>
                                <div style={{ color: token.colorTextSecondary, fontSize: 13, marginBottom: 4 }}>{item.message}</div>
                                <div style={{ color: token.colorTextTertiary, fontSize: 11 }}>{formatTime(item.created_at)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const BellButton = (
        <Badge count={unreadCount} size="small" offset={[-6, 4]} color="#ff4d4f" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Button
                type="text"
                icon={unreadCount > 0 ? <AlertUrgentFilled style={{ fontSize: 26, color: '#ff4d4f' }} /> : <AlertFilled style={{ fontSize: 26, color: token.colorTextSecondary }} />}
                onClick={() => {
                    if (isMobile) {
                        setDrawerOpen(!drawerOpen);
                        if (!drawerOpen) {
                            fetchNotifications(true);
                        }
                    } else {
                        setPopoverOpen(!popoverOpen);
                        if (!popoverOpen) {
                            fetchNotifications(true);
                        }
                    }
                }}
                style={{
                    width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 10,
                    color: token.colorTextSecondary,
                }}
            />
        </Badge>
    );

    if (isMobile) {
        return (
            <ConfigProvider theme={{ token: { fontFamily: "'Poppins', sans-serif" } }}>
                <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');" }} />
                {BellButton}
                <Drawer
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ width: 40, height: 4, backgroundColor: token.colorBorder, borderRadius: 4, marginBottom: 16 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: 18 }}>System Alerts</Text>
                                <div>
                                    <Button type="link" onClick={handleClearLoaded} style={{ padding: 0, marginRight: 16, color: token.colorTextSecondary }}>
                                        Clear
                                    </Button>
                                    {unreadCount > 0 && (
                                        <Button type="link" onClick={handleMarkAllAsRead} style={{ padding: 0 }}>
                                            Read All
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    }
                    placement="bottom"
                    closable={false}
                    onClose={() => setDrawerOpen(false)}
                    open={drawerOpen}
                    styles={{
                        wrapper: { height: '85vh' },
                        body: { padding: 0, backgroundColor: token.colorBgLayout },
                        header: { borderBottom: `1px solid ${token.colorBorderSecondary}`, padding: '12px 20px 16px', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                        content: { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }
                    }}
                >
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', height: '100%' }}>
                        {loading && notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
                        ) : notifications.length === 0 ? (
                            <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 60 }} />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {notifications.map(item => (
                                    <div
                                        key={item.id}
                                        style={{
                                            padding: '16px',
                                            backgroundColor: item.read_at ? token.colorBgContainer : 'rgba(255, 77, 79, 0.04)',
                                            border: `1px solid ${item.read_at ? token.colorBorderSecondary : 'rgba(255, 77, 79, 0.2)'}`,
                                            borderRadius: 12,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        onClick={() => {
                                            if (!item.read_at) handleMarkAsRead(item.id);
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                            <Text strong={!item.read_at} style={{ fontSize: 14, lineHeight: 1.3 }}>{item.title}</Text>
                                            {!item.read_at && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff4d4f', marginTop: 4, flexShrink: 0, marginLeft: 8 }} />}
                                        </div>
                                        <div style={{ color: token.colorTextSecondary, fontSize: 14, marginBottom: 6 }}>{item.message}</div>
                                        <div style={{ color: token.colorTextTertiary, fontSize: 12 }}>{formatTime(item.created_at)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Drawer>
            </ConfigProvider>
        );
    }

    return (
        <ConfigProvider theme={{ token: { fontFamily: "'Poppins', sans-serif" } }}>
            <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');" }} />
            <Popover
            content={content}
            trigger="click"
            open={popoverOpen}
            onOpenChange={(open) => {
                setPopoverOpen(open);
                if (open) fetchNotifications();
            }}
            placement="bottomRight"
            arrow={false}
            styles={{ body: { padding: '16px 12px' } }}
        >
            {BellButton}
        </Popover>
        </ConfigProvider>
    );
}
