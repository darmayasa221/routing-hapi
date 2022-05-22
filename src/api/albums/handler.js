class AlbumsHandlers {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler({ payload }, h) {
    this._validator.validateAlbumPayload(payload);
    const id = await this._services.addAlbum(payload);
    const response = h.respons({
      status: 'success',
      data: {
        albumid: id,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumHandler({ params }, h) {
    await this._services.verifyAlbumId(params.id);
    const album = await this._services.getAlbum(params.id);
    return h.response({
      status: 'success',
      data: {
        album,
      },
    });
  }
}

module.exports = AlbumsHandlers;
