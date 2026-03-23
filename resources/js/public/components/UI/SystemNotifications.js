import { message, notification } from 'antd';

/**
 * Standardized Feedback, Alert, and Notification functions
 * using Ant Design components.
 */

export const Feedback = {
    success: (msg, desc = '') => {
        if (desc) {
            notification.success({ message: msg, description: desc, placement: 'topRight' });
        } else {
            message.success(msg);
        }
    },
    error: (msg, desc = '') => {
        if (desc) {
            notification.error({ message: msg, description: desc, placement: 'topRight' });
        } else {
            message.error(msg);
        }
    },
    info: (msg, desc = '') => {
        if (desc) {
            notification.info({ message: msg, description: desc, placement: 'topRight' });
        } else {
            message.info(msg);
        }
    },
    warning: (msg, desc = '') => {
        if (desc) {
            notification.warning({ message: msg, description: desc, placement: 'topRight' });
        } else {
            message.warning(msg);
        }
    },
};

export const CustomAlert = { ...Feedback };
export const CustomNotification = { ...Feedback };
