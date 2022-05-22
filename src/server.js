const Hapi = require('@hapi/hapi');
// routes
const albums = require('./api/albums/index');
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
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
  ]);
  await server.start();
  // eslint-disable-next-line no-console
  console.log(`server runing on ${server.info.uri}`);
};

init();
