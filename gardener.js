// eslint-disable-next-line import/no-extraneous-dependencies
const gardener = require('js-gardener');

if (require.main === module) {
  gardener({
    eslint: { rules: { "enforce-flow": 0 } }
  }).catch(() => process.exit(1));
}
