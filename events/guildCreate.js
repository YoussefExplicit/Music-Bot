const Event = require('../util/Event');

class GuildCreate extends Event {
  constructor(...args) {
    super(...args);
  }

  run(guild) {
    this.client.setDefaultGuildSettings(guild.id);
  }
}

module.exports = GuildCreate;