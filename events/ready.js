const Event = require('../util/Event.js');
const fs = require('fs');

class Ready extends Event {

  constructor(...args) {
    super(...args);
  }

  async run() {
    this.client.log(`${this.client.user.tag} is ready in ${this.client.guilds.size} guild and serving ${this.client.guilds.reduce((c, p) => c + p.memberCount, 0)} users!`);
    this.client.guilds.forEach(g => {
      if (!this.client.settings.has(g.id)) this.client.setDefaultGuildSettings(g.id);
    });

    if (fs.existsSync('./data/reboot.json')) {
      const data = JSON.parse(fs.readFileSync('./data/reboot.json', 'utf8'));
      const channel = this.client.channels.get(data.channelID);
      const message = await channel.messages.fetch(data.messageID);
      message.edit('Successfully rebooted the bot!');
      fs.unlinkSync('./data/reboot.json');
    }
  }
}

module.exports = Ready;