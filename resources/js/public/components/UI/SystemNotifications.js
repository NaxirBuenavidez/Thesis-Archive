import { notification } from 'antd';

// Configure global notification settings
notification.config({
    placement: 'topLeft',
    top: 20,
    duration: 3,
});

/**
 * Standardized Feedback, Alert, and Notification functions
 * positioned at the upper top-left of the screen.
 */

export const Feedback = {
    success: (msg, desc = '') => notification.success({ message: msg, description: desc, placement: 'topLeft' }),
    error: (msg, desc = '') => notification.error({ message: msg, description: desc, placement: 'topLeft' }),
    info: (msg, desc = '') => notification.info({ message: msg, description: desc, placement: 'topLeft' }),
    warning: (msg, desc = '') => notification.warning({ message: msg, description: desc, placement: 'topLeft' }),
};

export const CustomAlert = { ...Feedback };
export const CustomNotification = { ...Feedback };
