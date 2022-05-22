class AlbumsHandlers {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler({ payload }, h) {
    this._validator.validateAlbumPayload(payload);
    const album = await this._service.addAlbum(payload);
    const response = h.respons({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandlers;
