const ENABLED = typeof __DEV__ !== 'undefined' && __DEV__;

export function logApi(stage, detail) {
    if (!ENABLED) {
        return;
    }
    const time = new Date().toISOString().slice(11, 23);
    if (typeof detail === 'object' && detail !== null) {
        console.log(`[Florynn API ${time}] ${stage}`, detail);
    } else {
        console.log(`[Florynn API ${time}] ${stage}`, detail ?? '');
    }
}
