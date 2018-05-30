const Event = require('../util/Event');

class GuildDelete extends Event {
  constructor(...args) {
    super(...args);
  }

  run(guild) {
    this.client.settings.delete(guild.id);
  }
}

module.exports = GuildDelete;