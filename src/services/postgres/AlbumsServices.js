const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum(payload) {
    const {
      name,
      year,
    } = payload;
    const id = `albums-${nanoid()}`;
    const query = {
      text: `INSERT INTO albums
      VALUES ($1, $2, $3) RETRUNING id`,
      values: [id, name, year],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new InvariantError('failed to added album');
    }
    return rows[0].id;
  }

  async getAlbum(id) {
    const query = {
      text: `SELECT * FROM albums
      WHERE id = $1`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async editAlbumById(payload) {
    const {
      id,
      name,
      year,
    } = payload;
    const query = {
      text: `UPDATE albums
      SET name = $1, year = $2
      WHERE id = $3`,
      values: [name, year, id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new InvariantError('failed to edited album');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM albums
      WHERE id = $1`,
      values: [id],
    };
    await this._pool.query(query);
  }

  async verifyAlbumId(id) {
    const query = {
      text: `SELECT id FROM albums
      WHERE id = $1`,
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('albums not found');
    }
  }
}

module.exports = AlbumsServices;
