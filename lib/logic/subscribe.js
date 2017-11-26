module.exports = (event, context, callback, rb) => {
  console.log(JSON.stringify(event));
  callback(null);
};
