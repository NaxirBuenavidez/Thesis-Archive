/**
 * Utility to map Laravel validation errors (422) to Ant Design Form fields.
 * 
 * @param {Object} error - The axios error object
 * @param {Object} form - The Ant Design useForm instance
 */
export const handleFormErrors = (error, form) => {
    if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const fields = Object.keys(errors).map(key => ({
            name: key,
            errors: errors[key],
        }));
        form.setFields(fields);
        return true;
    }
    return false;
};

/**
 * Common validation rules for Ant Design Forms.
 */
export const validationRules = {
    required: (label) => ({ required: true, message: `Please enter ${label}` }),
    email: { type: 'email', message: 'Please enter a valid email' },
    doi: { pattern: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i, message: 'Please enter a valid DOI format' },
    url: { type: 'url', message: 'Please enter a valid URL' },
};
