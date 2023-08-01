import fs from 'smart-fs';
import LRU from 'lru-cache-ext';
import Joi from 'joi-strict';

const lru = new LRU({
  ttl: 60 * 60 * 1000,
  max: 10
});

export default (filepath = 'config.json') => lru.memoizeSync('config', () => {
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
