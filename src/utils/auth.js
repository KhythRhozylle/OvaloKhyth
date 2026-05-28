const STAFF_ROLES = ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_STAFF'];

export function getUserRoles(user) {
    if (!user) {
        return [];
    }
    if (Array.isArray(user.roles)) {
        return user.roles;
    }
    return [];
}

export function isStaffOrAdmin(user) {
    const roles = getUserRoles(user);
    return roles.some(role => STAFF_ROLES.includes(role));
}

/** Customer app accepts ROLE_USER only (guest browsing needs no role). */
export function isCustomerUser(user) {
    if (!user) {
        return false;
    }
    if (isStaffOrAdmin(user)) {
        return false;
    }
    const roles = getUserRoles(user);
    if (roles.length === 0) {
        return true;
    }
    return roles.includes('ROLE_USER');
}

export function normalizeLoginResponse(data) {
    const token = data?.token || data?.access_token;
    const user = data?.user || data?.data?.user || null;
    return { token, user };
}

/** Display label for account type in the mobile app. */
export function formatUserRoleLabel(user) {
    if (!user) {
        return 'User';
    }
    const roles = getUserRoles(user);
    if (roles.includes('ROLE_ADMIN')) {
        return 'Admin';
    }
    if (roles.includes('ROLE_STAFF')) {
        return 'Staff';
    }
    return 'User';
}
