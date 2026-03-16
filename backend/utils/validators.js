const { HttpError } = require('./httpError');

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => {
    const value = body[field];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new HttpError(400, `Missing required fields: ${missing.join(', ')}`);
  }
};

module.exports = { requireFields };
