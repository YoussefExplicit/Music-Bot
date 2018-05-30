/* eslint linebreak-style: 0 */
const Command = require('../util/Command.js');

class Loop extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      description: 'This command will loop or unloop the current playing song.',
      usage: 'loop',
      aliases: ['unloop'],
      cooldown: 5,
      category: 'Music'
    });
  }

  async run(message) {
    if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed('notDJ', message);
    const voiceChannel = message.member.voiceChannel;
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    if (!voiceChannel) return this.client.embed('noVoiceChannel', message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed('emptyQueue', message);
    if (thisPlaylist.loop) {
      thisPlaylist.loop = false;
      return this.client.embed('unloopedEmbed', message);
    } else {
      thisPlaylist.loop = true;
      return this.client.embed('loopedEmbed', message);
    }
  }
}

module.exports = Loop;