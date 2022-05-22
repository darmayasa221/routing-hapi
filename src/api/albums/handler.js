class AlbumsHandlers {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumHandler = this.getAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.getSongByAlbumIdHandler = this.getSongByAlbumIdHandler.bind(this);
  }

  async postAlbumHandler({ payload }, h) {
    this._validator.validateAlbumPayload(payload);
    const id = await this._services.addAlbum(payload);
    const response = h.response({
      status: 'success',
      data: {
        albumId: id,
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

  async putAlbumByIdHandler({ params, payload }, h) {
    await this._services.verifyAlbumId(params.id);
    this._validator.validateAlbumPayload(payload);
    await this._services.editAlbumById({ id: params.id, ...payload });
    return h.response({
      status: 'success',
      message: 'the album been edited!',
    });
  }

  async deleteAlbumByIdHandler({ params }, h) {
    await this._services.verifyAlbumId(params.id);
    await this._services.deleteAlbumById(params.id);
    return h.response({
      status: 'success',
      message: 'the album been deleted!',
    });
  }

  async getSongByAlbumIdHandler({ params }, h) {
    await this._services.verifyAlbumId(params.albumId);
    const result = await this._services.getSongByAlbumId(params.albumId);
    return h.response({
      status: 'success',
      data: {
        result,
      },
    });
  }
}

module.exports = AlbumsHandlers;
