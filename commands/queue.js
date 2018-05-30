const Command = require('../util/Command.js');

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      description: 'This command will display all songs in the queue.',
      extended: 'This command will display all of the songs in the queue, if the queue is too large, it will upload the queue to hastebin, where the user could see all of the songs',
      usage: 'queue',
      cooldown: 5,
      category: 'Music'
    });
  }

  async run(message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed('noVoiceChannel', message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed('emptyQueue', message);
    return this.client.embed('queueEmbed', message);
  } 
}


module.exports = Queue;