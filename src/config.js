import fs from 'smart-fs';
import Joi from 'joi-strict';

export default (filepath = 'config.json') => {
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
};
