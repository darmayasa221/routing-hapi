class SongsHandlers {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    this._validator.validateSongPayload(payload);
    const id = await this._services.addSong(payload);
    const response = h.response({
      status: 'success',
      data: {
        songId: id,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = SongsHandlers;
