class SongsHandlers {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
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

  async getSongsHandler(request, h) {
    const songs = await this._services.getSongs();
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async getSongByIdHandler({ params }, h) {
    await this._services.verifySongsId(params.id);
    const song = await this._services.getSongById(params.id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    });
  }
}

module.exports = SongsHandlers;
