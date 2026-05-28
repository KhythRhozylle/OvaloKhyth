const ADMIN_ROLES = ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];
const STAFF_ROLES = ['ROLE_STAFF', ...ADMIN_ROLES];

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

/** Human-readable role for the mobile profile (never "Staff" for app customers). */
export function getMobileRoleLabel(user) {
    if (!user || isStaffOrAdmin(user)) {
        return '';
    }
    if (user.roleLabel) {
        return user.roleLabel;
    }
    return 'User';
}

export function normalizeLoginResponse(data) {
    const token = data?.token || data?.access_token;
    const rawUser = data?.user || data?.data?.user || null;
    const user = rawUser
        ? {
              ...rawUser,
              roleLabel: getMobileRoleLabel(rawUser),
          }
        : null;
    return { token, user };
}
