import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import localConfig from '../../config/api.local';
import {
    getDevApiBaseUrlSync,
    loadDevApiBaseUrl,
    saveDevApiBaseUrlFromHost,
    setDevApiBaseUrl,
} from '../../config/devApiBase';
import { COLORS, RADIUS } from '../../constants/theme';

/** Dev-only: PC IP (Wi-Fi) or 127.0.0.1 with USB + adb reverse. */
const DevServerField = () => {
    const [host, setHost] = useState(localConfig?.androidHost ?? '');
    const [status, setStatus] = useState('');
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        loadDevApiBaseUrl().then(() => {
            const base = getDevApiBaseUrlSync();
            const match = base.match(/^https?:\/\/([^:/]+)/);
            if (match?.[1]) {
                setHost(match[1]);
            }
            setStatus(`Using ${base}`);
        });
    }, []);

    const applyHost = async (test = false) => {
        const base = await saveDevApiBaseUrlFromHost(host);
        if (!base) {
            setStatus('Enter your PC IP (from ipconfig).');
            return;
        }
        setDevApiBaseUrl(base);
        setStatus(`Using ${base}`);
        if (!test) {
            return;
        }
        setTesting(true);
        try {
            const res = await fetch(`${base}/api/mobile/products`, {
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                setStatus(`Connected — ${base}`);
            } else {
                setStatus(`Server replied ${res.status} — check API is running.`);
            }
        } catch {
            setStatus(`No connection to ${base}. Run: npm run dev:connect on your PC.`);
        } finally {
            setTesting(false);
        }
    };

    if (!__DEV__) {
        return null;
    }

    return (
        <View
            style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: '#FFF8E8',
                borderRadius: RADIUS.sm,
                borderWidth: 1,
                borderColor: '#E8D4A0',
            }}
        >
            <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.text, marginBottom: 6 }}>
                DEV — Server IP (your PC)
            </Text>
            <TextInput
                value={host}
                onChangeText={setHost}
                placeholder="127.0.0.1 or 192.168.1.16"
                keyboardType="decimal-pad"
                autoCapitalize="none"
                style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: RADIUS.sm,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                    backgroundColor: COLORS.white,
                    marginBottom: 8,
                }}
            />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => applyHost(true)}
                    disabled={testing}
                    style={{
                        flex: 1,
                        marginRight: 6,
                        backgroundColor: COLORS.florynn.primary,
                        borderRadius: RADIUS.sm,
                        paddingVertical: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 12 }}>
                        {testing ? 'Testing…' : 'Test connection'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => applyHost(false)}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: COLORS.florynn.primary,
                        borderRadius: RADIUS.sm,
                        paddingVertical: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.florynn.primary, fontWeight: '600', fontSize: 12 }}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
            {status ? (
                <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8 }}>{status}</Text>
            ) : null}
        </View>
    );
};

export default DevServerField;
