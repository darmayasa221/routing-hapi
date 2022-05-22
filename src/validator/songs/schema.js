const Joi = require('joi');

const SongsPayloadSchema = Joi.object({
  titile: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string().required(),
});

module.exports = { SongsPayloadSchema };
