const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        // Block SVG native module if any stale import remains in cache.
        blockList: [/node_modules[\\/]react-native-svg[\\/]/],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
