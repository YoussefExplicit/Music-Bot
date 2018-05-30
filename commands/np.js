/* eslint linebreak-style: 0 */
const Command = require('../util/Command.js');

class NP extends Command {
  constructor(client) {
    super(client, {
      name: 'np',
      description: 'This command will display the current playing song.',
      usage: 'np',
      aliases: ['nowplaying', 'current'],
      cooldown: 5,
      category: 'Music'
    });
  }

  async run(message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed('noVoiceChannel', message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed('emptyQueue', message);
    return this.client.embed('nowPlaying', message);
  }
} 

module.exports = NP;