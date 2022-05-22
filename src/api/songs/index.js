const SongsHadlers = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  register: async (server, { services, validator }) => {
    const songsHandlers = new SongsHadlers(services, validator);
    server.routes(routes(songsHandlers));
  },
};
