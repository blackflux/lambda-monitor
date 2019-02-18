// eslint-disable-next-line import/no-extraneous-dependencies
const gardener = require('js-gardener');

if (require.main === module) {
  gardener({
    author: 'Lukas Siemon',
    docker: ['lambda'],
    ci: ['circle'],
    dependabot: true
  }).catch(() => process.exit(1));
}
