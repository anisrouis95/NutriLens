// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase's JS SDK ships ESM and CommonJS builds side by side, and Metro picks
// one by how a module is loaded (`import` vs `require`). On Android/iOS the
// @firebase/auth React Native build `require`s @firebase/app while firebase/app
// `import`s it, so the bundle ends up with two Firebase app registries and auth
// fails with "Component auth has not been registered yet". Resolving every
// @firebase/* package the CommonJS way on native keeps a single copy. The web
// build is left alone (it already resolves consistently).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform !== 'web' && moduleName.startsWith('@firebase/')) {
    return context.resolveRequest({ ...context, isESMImport: false }, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
