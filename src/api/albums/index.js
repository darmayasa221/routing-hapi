const AlbumsHandlers = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  register: async (server, { services, validator }) => {
    const albumsHandlers = new AlbumsHandlers(services, validator);
    server.route(routes(albumsHandlers));
  },
};
