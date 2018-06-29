const reflect = promise => new Promise(resolve => promise
  .then(v => resolve({ value: v, success: true }))
  .catch(e => resolve({ error: e, success: false })));

module.exports = promises => Promise.all(promises.map(reflect))
  .then(results => new Promise((resolve, reject) => {
    const errors = results.filter(r => r.success === false);
    if (errors.length !== 0) {
      return reject(errors.length === 1 ? errors[0].error : new Error(errors.map(e => e.error.message).join(", ")));
    }
    return resolve(results.map(r => r.value));
  }));
