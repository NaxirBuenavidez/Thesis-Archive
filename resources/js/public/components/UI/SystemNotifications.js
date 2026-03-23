/**
 * Standardized Feedback, Alert, and Notification functions
 * using Syncfusion Toast via global event dispatch.
 */

const dispatchToast = (type, title, content) => {
    const detail = {
        title: title || (type.charAt(0).toUpperCase() + type.slice(1)),
        content: content || '',
        cssClass: `e-toast-${type}`
    };

    window.dispatchEvent(new CustomEvent('show-system-toast', { detail }));
};

export const Feedback = {
    success: (msg, desc = '') => dispatchToast('success', msg, desc),
    error: (msg, desc = '') => dispatchToast('error', msg, desc),
    info: (msg, desc = '') => dispatchToast('info', msg, desc),
    warning: (msg, desc = '') => dispatchToast('warning', msg, desc),
};

export const CustomAlert = { ...Feedback };
export const CustomNotification = { ...Feedback };
