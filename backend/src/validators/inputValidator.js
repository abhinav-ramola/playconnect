/**
 * Validate user signup input
 */
export const validateSignup = (data) => {
    const errors = {};

    if (!data.firstName || data.firstName.trim() === '') {
        errors.firstName = 'First name is required';
    }

    if (!data.lastName || data.lastName.trim() === '') {
        errors.lastName = 'Last name is required';
    }

    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (!data.phone || data.phone.trim() === '') {
        errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(data.phone.replace(/[-\s]/g, ''))) {
        errors.phone = 'Phone must be 10 digits';
    }

    if (!data.password || data.password === '') {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!data.city || data.city.trim() === '') {
        errors.city = 'City is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate user login input
 */
export const validateLogin = (data) => {
    const errors = {};

    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email is required';
    }

    if (!data.password || data.password === '') {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate match creation
 */
export const validateCreateMatch = (data) => {
    const errors = {};

    if (!data.title || data.title.trim() === '') {
        errors.title = 'Match title is required';
    }

    if (!data.sport || data.sport.trim() === '') {
        errors.sport = 'Sport type is required';
    }

    if (!data.location || !data.location.address || data.location.address.trim() === '') {
        errors.location = 'Location address is required';
    }

    if (!data.matchDate) {
        errors.matchDate = 'Match date is required';
    }

    if (!data.playersNeeded || data.playersNeeded < 1) {
        errors.playersNeeded = 'Players needed must be at least 1';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
