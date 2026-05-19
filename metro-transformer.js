const path = require('path');

// Resolve the upstream Babel transformer that ships inside the expo package
const expoDir = path.dirname(require.resolve('expo/package.json'));
const upstreamTransformer = require(
  path.join(expoDir, 'node_modules', '@expo', 'metro-config', 'build', 'babel-transformer.js')
);

module.exports.transform = async function (params) {
  // Strip webpack magic comments (/* webpackIgnore: true */ etc.) before
  // Babel / Hermes see the source — Hermes cannot parse them.
  const src = params.src.replace(/\/\*\s*webpack[A-Za-z]*[^*]*\*\//g, '');
  return upstreamTransformer.transform({ ...params, src });
};
