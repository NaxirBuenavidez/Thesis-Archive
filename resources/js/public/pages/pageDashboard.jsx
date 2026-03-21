import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Card, Row, Col, Tag, Table, Spin, theme, Space, Avatar, Grid, Divider, Progress
} from 'antd';
const { useBreakpoint } = Grid;
import {
    DocumentTextFilled,
    CheckmarkCircleFilled,
    ClockFilled,
    PeopleFilled,
    LockClosedFilled,
    DismissCircleFilled,
    DocumentCheckmarkFilled,
    BookFilled,
    ArrowTrending20Filled,
} from '@fluentui/react-icons';
import {
    ResponsiveContainer,
    AreaChart, Area,
    BarChart, Bar, Cell as BarCell,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ReferenceLine
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';

const { Title, Text } = Typography;

const ANIM_CSS = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fluentPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.18) rotate(-5deg); }
    70%  { transform: scale(0.95) rotate(3deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  .dash-card-enter { animation: fadeSlideUp 0.35s ease both; }
`;
if (typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.textContent = ANIM_CSS;
    document.head.appendChild(s);
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const statusTagColor = (status) => {
    const map = {
        published: 'green', accepted: 'blue', under_review: 'gold',
        submitted: 'cyan', draft: 'default', rejected: 'red'
    };
    return map[status] || 'default';
};

const StatCard = React.memo(({ title, value, icon, accentColor, subtext, large = false }) => {
    const { token } = theme.useToken();
    const [hovered, setHovered] = useState(false);

    if (large) {
        return (
            <Card
                className="dash-card-enter"
                style={{
                    borderRadius: 16,
                    border: 'none',
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                    overflow: 'hidden',
                    cursor: 'default',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: hovered ? `0 14px 32px ${accentColor}55` : `0 8px 24px ${accentColor}44`,
                }}
                styles={{ body: { padding: '24px 28px' } }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{title}</Text>
                        <Text style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1, display: 'block', letterSpacing: '-1px' }}>{value}</Text>
                        {subtext && <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6, display: 'block' }}>{subtext}</Text>}
                    </div>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: hovered ? 'fluentPop 0.45s ease forwards' : 'none' }}>
                        {React.cloneElement(icon, { style: { color: '#fff', fontSize: 26 } })}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="dash-card-enter"
            style={{
                borderRadius: 14,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
                cursor: 'default',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hovered ? `0 6px 20px rgba(0,0,0,0.08)` : `0 1px 4px rgba(0,0,0,0.04)`,
                borderColor: hovered ? accentColor + '55' : token.colorBorderSecondary,
            }}
            styles={{ body: { padding: '18px 20px' } }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 11, display: 'block', marginBottom: 6, color: token.colorTextTertiary, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</Text>
                    <Text style={{ fontSize: 30, fontWeight: 800, color: token.colorText, lineHeight: 1, letterSpacing: '-0.5px', display: 'block' }}>{value}</Text>
                </div>
                <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: accentColor + '14',
                    border: `1px solid ${accentColor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    animation: hovered ? 'fluentPop 0.45s ease forwards' : 'none',
                }}>
                    {React.cloneElement(icon, { style: { color: accentColor, fontSize: 22 } })}
                </div>
            </div>
        </Card>
    );
});

const SectionHeader = React.memo(({ icon, title, subtitle }) => {
    const { token } = theme.useToken();
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {React.cloneElement(icon, { style: { color: token.colorPrimary, fontSize: 16 } })}
                <Text strong style={{ fontSize: 14, color: token.colorText, letterSpacing: '0.1px' }}>{title}</Text>
            </div>
            {subtitle && <Text type="secondary" style={{ fontSize: 12, marginLeft: 24, display: 'block', marginTop: 2 }}>{subtitle}</Text>}
        </div>
    );
});

export default function Dashboard() {
    const { user } = useAuth();
    const { token } = theme.useToken();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { primary_color_dark, site_title } = useSystemConfig();
    const sidebarColor = primary_color_dark || '#1A2CA3';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const CHART_COLORS = [
        token.colorPrimary,
        '#10b981',
        '#f59e0b',
        '#6366f1',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
    ];

    const STATUS_COLOR_MAP = {
        'Published': '#10b981',
        'Accepted': token.colorInfo,
        'Under Review': '#f59e0b',
        'Submitted': token.colorPrimary,
        'Draft': token.colorTextTertiary,
        'Rejected': '#ef4444',
    };

    const tooltipStyle = {
        borderRadius: 10,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        boxShadow: token.boxShadowSecondary,
        color: token.colorText,
        padding: '8px 14px',
        fontSize: 12,
    };

    const cardStyle = {
        borderRadius: 14,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
    };

    const fetchAnalytics = useCallback(async () => {
        try {
            const resp = await window.axios.get('/api/dashboard/analytics');
            setData(resp.data);
        } catch {
            // use empty defaults
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial load logic: skip if already in bootData
        if (window.__boot_data && window.__boot_data.analytics) {
            setData(window.__boot_data.analytics);
            setLoading(false);
        } else {
            fetchAnalytics();
        }
        
        const interval = setInterval(fetchAnalytics, 60000);
        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    if (loading) {
        return null; // GlobalLoader from LoadingContext handles the visual
    }

    const {
        totals, byStatus, byDept, monthlyTrend, recentActivity, byDegree, topDept
    } = React.useMemo(() => ({
        totals: data?.totals || {},
        byStatus: data?.by_status || [],
        byDept: data?.by_department || [],
        monthlyTrend: data?.monthly_trend || [],
        recentActivity: data?.recent_activity || [],
        byDegree: data?.by_degree_type || [],
        topDept: data?.top_dept_published || [],
    }), [data]);

    const actCols = React.useMemo(() => [
        {
            title: 'Thesis',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (t) => <Text strong style={{ fontSize: 13 }}>{t}</Text>
        },
        { title: 'Author', dataIndex: 'author', key: 'author', render: (a) => <Text style={{ fontSize: 13 }}>{a}</Text>, responsive: ['md'] },
        { title: 'Department', dataIndex: 'department', key: 'department', render: (d) => <Text type="secondary" style={{ fontSize: 12 }}>{d || '—'}</Text>, responsive: ['lg'] },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (s) => (
                <Tag
                    color={statusTagColor(s)}
                    style={{ borderRadius: 20, fontSize: 11, fontWeight: 600, border: 'none', padding: '2px 10px' }}
                >
                    {s?.replace('_', ' ').toUpperCase()}
                </Tag>
            )
        },
        { title: 'Updated', dataIndex: 'updated_at', key: 'updated_at', render: (t) => <Text type="secondary" style={{ fontSize: 12 }}>{t}</Text>, responsive: ['md'] },
    ], []);

    const publishedPct = React.useMemo(() => (
        totals.total_theses > 0
            ? Math.round((totals.published / totals.total_theses) * 100)
            : 0
    ), [totals.total_theses, totals.published]);

    return (
        <div style={{ paddingBottom: 8 }}>

            {/* ── Welcome Banner ── */}
            <div style={{
                borderRadius: 16,
                background: `linear-gradient(135deg, ${sidebarColor} 0%, ${sidebarColor}cc 60%, ${token.colorPrimary} 100%)`,
                padding: isMobile ? '20px 20px' : '24px 32px',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}>
                {/* decorative circles */}
                <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -40, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Text style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 4 }}>
                        {getGreeting()}
                    </Text>
                    <Title level={isMobile ? 4 : 3} style={{ color: '#fff', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
                        {user?.name || 'User'}
                    </Title>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, display: 'block' }}>
                        {site_title || 'Thesis Archive'} &mdash; {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </Text>
                </div>
                {!isMobile && (
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
                        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 4 }}>Publication Rate</Text>
                        <Text style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{publishedPct}%</Text>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', display: 'block', marginTop: 2 }}>{totals.published ?? 0} of {totals.total_theses ?? 0} published</Text>
                    </div>
                )}
            </div>

            {/* ── Stat Cards ── */}
            <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
                {/* Hero card */}
                <Col xs={24} sm={12} md={6}>
                    <StatCard
                        title="Total Theses"
                        value={totals.total_theses ?? 0}
                        icon={<DocumentTextFilled />}
                        accentColor={sidebarColor}
                        large
                    />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Published" value={totals.published ?? 0} icon={<DocumentCheckmarkFilled />} accentColor="#10b981" />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Pending Review" value={totals.pending_review ?? 0} icon={<ClockFilled />} accentColor="#f59e0b" />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Total Users" value={totals.total_users ?? 0} icon={<PeopleFilled />} accentColor="#6366f1" />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Accepted" value={totals.accepted ?? 0} icon={<CheckmarkCircleFilled />} accentColor="#10b981" />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Rejected" value={totals.rejected ?? 0} icon={<DismissCircleFilled />} accentColor="#ef4444" />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Draft" value={totals.draft ?? 0} icon={<BookFilled />} accentColor={token.colorTextTertiary} />
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <StatCard title="Confidential" value={totals.confidential ?? 0} icon={<LockClosedFilled />} accentColor="#8b5cf6" />
                </Col>
            </Row>

            {/* ── Charts Row 1 ── */}
            <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
                <Col xs={24} lg={15}>
                    <Card style={cardStyle} styles={{ body: { padding: isMobile ? '16px 16px 10px' : '22px 22px 12px' } }}>
                        <SectionHeader
                            icon={<ArrowTrending20Filled />}
                            title="Monthly Submission Trend"
                            subtitle="Submissions vs accepted — last 12 months"
                        />
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradSubmit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={token.colorPrimary} stopOpacity={0.28} />
                                        <stop offset="100%" stopColor={token.colorPrimary} stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="gradAccept" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke={token.colorBorderSecondary} vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: token.colorTextTertiary }} axisLine={false} tickLine={false} dy={6} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: token.colorTextTertiary }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    cursor={{ stroke: token.colorBorderSecondary, strokeWidth: 1, strokeDasharray: '5 3' }}
                                />
                                <Legend
                                    iconType="circle" iconSize={8}
                                    wrapperStyle={{ fontSize: 11, paddingTop: 8, color: token.colorTextSecondary }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="submissions"
                                    name="Submissions"
                                    stroke={token.colorPrimary}
                                    strokeWidth={2.5}
                                    fill="url(#gradSubmit)"
                                    dot={false}
                                    activeDot={{ r: 5, fill: token.colorPrimary, stroke: '#fff', strokeWidth: 2, filter: 'url(#glow)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="accepted"
                                    name="Accepted"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="5 3"
                                    fill="url(#gradAccept)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={9}>
                    <Card style={{ ...cardStyle, height: '100%' }} styles={{ body: { padding: isMobile ? '16px' : '22px' } }}>
                        <SectionHeader icon={<DocumentTextFilled />} title="By Status" subtitle="Current distribution" />
                        {/* Donut with center total label */}
                        <div style={{ position: 'relative' }}>
                            <ResponsiveContainer width="100%" height={210}>
                                <PieChart>
                                    <defs>
                                        {byStatus.map((_, i) => {
                                            const c = STATUS_COLOR_MAP[_.name] || CHART_COLORS[i % CHART_COLORS.length];
                                            return (
                                                <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={c} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={c} stopOpacity={0.72} />
                                                </linearGradient>
                                            );
                                        })}
                                    </defs>
                                    <Pie
                                        data={byStatus}
                                        cx="50%" cy="48%"
                                        innerRadius={54} outerRadius={82}
                                        paddingAngle={2}
                                        dataKey="value" nameKey="name"
                                        stroke="none"
                                    >
                                        {byStatus.map((entry, i) => (
                                            <Cell key={i} fill={`url(#pieGrad${i})`} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        formatter={(val, name) => [`${val} theses`, name]}
                                    />
                                    <Legend
                                        iconType="circle" iconSize={7}
                                        wrapperStyle={{ fontSize: 11, color: token.colorTextSecondary }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label overlay */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 175,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                            }}>
                                <Text style={{ fontSize: 26, fontWeight: 800, color: token.colorText, lineHeight: 1 }}>
                                    {byStatus.reduce((a, b) => a + (b.value || 0), 0)}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>total</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* ── Charts Row 2 ── */}
            <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
                <Col xs={24} lg={15}>
                    <Card style={cardStyle} styles={{ body: { padding: isMobile ? '16px 16px 10px' : '22px 22px 12px' } }}>
                        <SectionHeader icon={<BookFilled />} title="Theses by Department" subtitle="Sorted by submission count" />
                        <ResponsiveContainer width="100%" height={Math.max(200, byDept.length * 36)}>
                            <BarChart data={byDept} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                                <defs>
                                    {byDept.map((_, i) => (
                                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor={token.colorPrimary} stopOpacity={0.85} />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.9} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke={token.colorBorderSecondary} horizontal={false} />
                                <XAxis
                                    type="number" allowDecimals={false}
                                    tick={{ fontSize: 11, fill: token.colorTextTertiary }}
                                    axisLine={false} tickLine={false}
                                />
                                <YAxis
                                    type="category" dataKey="name" width={130}
                                    tick={{ fontSize: 11, fill: token.colorTextSecondary }}
                                    axisLine={false} tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    cursor={{ fill: token.colorFillAlter }}
                                    formatter={(v) => [`${v} theses`, 'Count']}
                                />
                                <Bar
                                    dataKey="count"
                                    radius={[0, 8, 8, 0]}
                                    maxBarSize={20}
                                    background={{ fill: token.colorFillTertiary, radius: [0, 8, 8, 0] }}
                                    label={{ position: 'right', fontSize: 11, fill: token.colorTextTertiary }}
                                >
                                    {byDept.map((_, i) => (
                                        <BarCell key={i} fill={`url(#barGrad${i})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={9}>
                    <Card style={{ ...cardStyle, height: '100%' }} styles={{ body: { padding: isMobile ? '16px' : '22px' } }}>
                        <SectionHeader icon={<DocumentCheckmarkFilled />} title="By Degree Type" subtitle="Program-level breakdown" />
                        <div style={{ position: 'relative' }}>
                            <ResponsiveContainer width="100%" height={210}>
                                <PieChart>
                                    <defs>
                                        {byDegree.map((_, i) => {
                                            const c = CHART_COLORS[i % CHART_COLORS.length];
                                            return (
                                                <radialGradient key={i} id={`degGrad${i}`} cx="50%" cy="50%" r="50%">
                                                    <stop offset="0%" stopColor={c} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={c} stopOpacity={0.65} />
                                                </radialGradient>
                                            );
                                        })}
                                    </defs>
                                    <Pie
                                        data={byDegree}
                                        cx="50%" cy="48%"
                                        innerRadius={0}
                                        outerRadius={78}
                                        paddingAngle={3}
                                        dataKey="value" nameKey="name"
                                        stroke="none"
                                        label={({ name, percent }) =>
                                            percent > 0.05 ? `${Math.round(percent * 100)}%` : ''
                                        }
                                        labelLine={false}
                                    >
                                        {byDegree.map((entry, i) => (
                                            <Cell key={i} fill={`url(#degGrad${i})`} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        formatter={(val, name) => [`${val} theses`, name]}
                                    />
                                    <Legend
                                        iconType="square"
                                        iconSize={10}
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        wrapperStyle={{ fontSize: 11, color: token.colorTextSecondary, paddingTop: 8 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* ── Recent Activity ── */}
            <Card style={{ ...cardStyle, marginBottom: 14 }} styles={{ body: { padding: isMobile ? '16px' : '22px' } }}>
                <SectionHeader icon={<ClockFilled />} title="Recent Activity" subtitle="Latest thesis submissions and updates" />
                {isMobile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {recentActivity.length === 0 ? (
                            <Text type="secondary" style={{ textAlign: 'center', padding: 24, display: 'block' }}>No recent activity</Text>
                        ) : recentActivity.map(item => (
                            <div key={item.id} style={{ padding: '12px 14px', borderRadius: 10, background: token.colorFillAlter, border: `1px solid ${token.colorBorderSecondary}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                    <Text strong style={{ fontSize: 13, flex: 1 }} ellipsis={{ tooltip: item.title }}>{item.title}</Text>
                                    <Tag color={statusTagColor(item.status)} style={{ margin: 0, flexShrink: 0, fontSize: 11, borderRadius: 20, border: 'none' }}>{item.status?.replace('_', ' ').toUpperCase()}</Tag>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>{item.author} · {item.updated_at}</Text>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Table
                        dataSource={recentActivity}
                        columns={actCols}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        scroll={{ x: 600 }}
                        showHeader={false}
                        rowClassName={() => 'dash-activity-row'}
                    />
                )}
            </Card>

            {/* ── Top Departments ── */}
            {topDept.length > 0 && (
                <Card style={cardStyle} styles={{ body: { padding: isMobile ? '16px' : '22px' } }}>
                    <SectionHeader icon={<CheckmarkCircleFilled />} title="Top Published Departments" subtitle="Ranked by number of published theses" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {topDept.slice(0, 6).map((item, i) => {
                            const maxCount = topDept[0]?.published || 1;
                            const pct = Math.round((item.published / maxCount) * 100);
                            const barColor = CHART_COLORS[i % CHART_COLORS.length];
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 700, color: token.colorTextTertiary, width: 18, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</Text>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text strong style={{ fontSize: 13 }} ellipsis>{item.department}</Text>
                                            <Text type="secondary" style={{ fontSize: 12, flexShrink: 0, marginLeft: 8 }}>{item.published} published</Text>
                                        </div>
                                        <div style={{ height: 5, borderRadius: 3, background: token.colorFillTertiary, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 0.6s ease' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
}
