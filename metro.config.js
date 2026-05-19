const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Supabase bundles @opentelemetry code with webpack dynamic imports that
// Hermes cannot compile. Stub the entire namespace out — it's server-side
// tracing that has no effect in React Native.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@opentelemetry/')) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Strip webpack magic comments (/* webpackIgnore: true */ etc.) at the
// raw source level before Hermes compiles the bundle.
config.transformer.babelTransformerPath = require.resolve('./metro-transformer.js');

module.exports = withNativeWind(config, { input: './global.css' });
