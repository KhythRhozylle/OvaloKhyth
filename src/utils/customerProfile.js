import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@florynn/customer_profile';

export const EMPTY_PROFILE = {
    fullName: '',
    contactNumber: '',
    email: '',
    completeAddress: '',
    deliveryLocation: '',
    cityProvince: '',
    additionalNotes: '',
};

export function isProfileComplete(profile) {
    return Boolean(
        profile?.fullName?.trim() &&
            profile?.contactNumber?.trim() &&
            profile?.email?.trim() &&
            profile?.completeAddress?.trim() &&
            profile?.deliveryLocation?.trim() &&
            profile?.cityProvince?.trim(),
    );
}

export async function loadCustomerProfile() {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...EMPTY_PROFILE };
        }
        const parsed = JSON.parse(raw);
        return {
            fullName: parsed.fullName ?? parsed.name ?? '',
            contactNumber: parsed.contactNumber ?? parsed.phone ?? '',
            email: parsed.email ?? '',
            completeAddress: parsed.completeAddress ?? parsed.address ?? '',
            deliveryLocation: parsed.deliveryLocation ?? '',
            cityProvince: parsed.cityProvince ?? '',
            additionalNotes: parsed.additionalNotes ?? parsed.notes ?? '',
        };
    } catch {
        return { ...EMPTY_PROFILE };
    }
}

export async function saveCustomerProfile(profile) {
    const saved = {
        fullName: (profile.fullName || '').trim(),
        contactNumber: (profile.contactNumber || '').trim(),
        email: (profile.email || '').trim(),
        completeAddress: (profile.completeAddress || '').trim(),
        deliveryLocation: (profile.deliveryLocation || '').trim(),
        cityProvince: (profile.cityProvince || '').trim(),
        additionalNotes: (profile.additionalNotes || '').trim(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return saved;
}

export async function clearCustomerProfile() {
    await AsyncStorage.removeItem(STORAGE_KEY);
}

function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
}

/** Map auth user + saved profile for checkout (scoped to the signed-in account). */
export function mergeProfileWithAuth(saved, authUser) {
    if (!authUser) {
        return saved ?? { ...EMPTY_PROFILE };
    }

    const authEmail = normalizeEmail(authUser.email);
    const savedEmail = normalizeEmail(saved?.email);
    const sameAccount = authEmail && savedEmail === authEmail;

    if (!sameAccount) {
        return {
            ...EMPTY_PROFILE,
            fullName: (authUser.name || '').trim(),
            email: (authUser.email || '').trim(),
        };
    }

    return {
        ...EMPTY_PROFILE,
        ...saved,
        fullName: (saved.fullName || authUser.name || '').trim(),
        email: (authUser.email || '').trim(),
    };
}
