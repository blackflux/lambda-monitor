const fs = require('smart-fs');
const LRU = require('lru-cache-ext');
const Joi = require('joi-strict');

const lru = new LRU({ maxAge: 60 * 60 * 1000 });

module.exports = (filepath = 'config.json') => lru.memoizeSync('config', () => {
  const config = fs.existsSync(filepath)
    ? fs.smartRead(filepath)
    : { suppress: [] };
  Joi.assert(config, Joi.object().keys({
    suppress: Joi.array().items(Joi.string().regex(/^\^.+\$$/))
  }));
  const suppress = config.suppress.map((re) => new RegExp(re));
  return {
    isSuppressed: (msg) => suppress.some((re) => re.test(msg))
  };
});
