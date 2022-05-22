require('dotenv').config();
const Hapi = require('@hapi/hapi');
// routes
const albums = require('./api/albums/index');
const songs = require('./api/songs/index');
// services
const AlbumsServices = require('./services/postgres/AlbumsServices');
const SongsServices = require('./services/postgres/SongsServices');
// validator
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
// exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsServices();
  const songsServices = new SongsServices();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });
  await server.register([
    {
      plugin: albums,
      options: {
        services: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        servicesSongs: songsServices,
        validator: SongsValidator,
        servicesAlbums: AlbumsServices,
      },
    },
  ]);

  server.ext('onPreResponse', ({ response }, h) => {
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'server error',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });
  await server.start();
  // eslint-disable-next-line no-console
  console.log(`server runing on ${server.info.uri}`);
};

init();
