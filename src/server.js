const Hapi = require('@hapi/hapi');
// routes
const albums = require('./api/albums/index');
const ClientError = require('./exceptions/ClientError');
// services
const AlbumsServices = require('./services/postgres/AlbumsServices');
// validator
const AlbumsValidator = require('./validator/albums');

const init = async () => {
  const albumsService = new AlbumsServices();
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
