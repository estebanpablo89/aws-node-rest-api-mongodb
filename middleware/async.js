const asyncHandler = fn => (event, context, callback) =>
  Promise.resolve(fn(event, context, callback)).catch(callback);

module.exports = asyncHandler;
