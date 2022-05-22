class SongsHandlers {
  constructor(servicesSongs, validator, servicesAlbums) {
    this._serviceAlbums = servicesAlbums;
    this._servicesSongs = servicesSongs;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    this._validator.validateSongPayload(payload);
    const id = await this._servicesSongs.addSong(payload);
    const response = h.response({
      status: 'success',
      data: {
        songId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler({ query }, h) {
    if (query.title) {
      const songsByTitle = await this._servicesSongs.getSongByTitle(query.title);
      return h.response({
        status: 'success',
        data: {
          songs: songsByTitle,
        },
      });
    }
    if (query.performer) {
      const songsByPerformer = await this._servicesSongs.getSongByPerformer(query.performer);
      return h.response({
        status: 'success',
        data: {
          songs: songsByPerformer,
        },
      });
    }
    const songs = await this._servicesSongs.getSongs();
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async getSongByIdHandler({ params }, h) {
    await this._servicesSongs.verifySongId(params.id);
    const song = await this._servicesSongs.getSongById(params.id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    });
  }

  async putSongByIdHandler({ payload, params }, h) {
    await this._servicesSongs.verifySongId(params.id);
    this._validator.validateSongPayload(payload);
    await this._servicesSongs.editSongById({ id: params.id, ...payload });
    return h.response({
      status: 'success',
      message: 'song been edited!',
    });
  }

  async deleteSongByIdHandler({ params }, h) {
    await this._servicesSongs.verifySongId(params.id);
    await this._servicesSongs.deleteSongById(params.id);
    return h.response({
      status: 'success',
      message: 'song been deleted!',
    });
  }
}

module.exports = SongsHandlers;
