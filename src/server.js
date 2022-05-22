const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`server runing on ${server.info.uri}`);
};

init();
