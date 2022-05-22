const SongsHadlers = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  register: async (server, { servicesSongs, validator, servicesAlbums }) => {
    const songsHandlers = new SongsHadlers(servicesSongs, validator, servicesAlbums);
    server.route(routes(songsHandlers));
  },
};
