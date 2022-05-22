const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong(payload) {
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = payload;
    const id = `songs-${nanoid()}`;
    const query = {
      text: `INSERT INTO songs
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETRUNING id`,
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new InvariantError('failed to add song!');
    }
    return rows[0].id;
  }

  async getSongs() {
    const query = 'SELECT id, title, performer FROM songs';
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM songs
      WHERE id = $1`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async editSongById(payload) {
    const {
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = payload;
    const query = {
      text: `UPDATE songs
      SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6
      WHERE id = $7`,
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new InvariantError('failed to edited song!');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM songs
      WHERE id = $1`,
      values: [id],
    };
    await this._pool.query(query);
  }

  async verifySongId(id) {
    const query = {
      text: `SELECT id FROM songs
      WHERE id = $1`,
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('song not found!');
    }
  }
}

module.exports = SongsServices;
