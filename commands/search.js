/* eslint linebreak-style: 0 */
const Command = require('../util/Command.js');
const { MessageEmbed } = require('discord.js');
const ytapi = require('simple-youtube-api'); 
const { ytapikey } = require('../config.json');
const youtube = new ytapi(ytapikey); 
const handleVideo = require('../util/MusicHandling');

class Search extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      description: 'This command will allow a user to choose from 10 songs.',
      extended: 'This command will allow a user to choose from a selection of songs with a search phrase, limitting to 10 results',
      usage: 'search <song-name>',
      cooldown: 2,
      category: 'Music'
    });
  }

  async run(message, args) {    
    if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed('notDJ', message);
    const voiceChannel = message.member.voiceChannel;
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!voiceChannel) return this.client.embed('noVoiceChannel', message);
    if (!args[0]) return this.client.embed('noArgs', message);
    if (!permissions.has('CONNECT')) return this.client.embed('noPerms-CONNECT', message);
    if (!permissions.has('SPEAK')) return this.client.embed('noPerms-SPEAK', message);
    let video;
    try {
      const videos = await youtube.searchVideos(args.join(' '), 10);
      if (!videos.length) return this.client.embed('noSongsFound', message, args);
      let index = 0;
      const embed = new MessageEmbed()
        .setAuthor('Song Selection')
        .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
        .setFooter('Please provide a value to select one of the search results ranging from 1-10.')
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      message.channel.send(embed);
      const response = await message.channel.awaitMessages(msg2 => (msg2.content > 0 && msg2.content < 11) && msg2.author.id === message.author.id, {
        max: 1,
        time: 10000,
        errors: ['time']
      });
      if (!response) return this.client.embed('invalidEntry', message);
      const videoIndex = parseInt(response.first().content);
      video = await youtube.getVideoByID(videos[videoIndex - 1].id);
    } catch (err) {
      return this.client.embed('noSearchResults', message);
    }
    return handleVideo(video, message, voiceChannel);
  }
}

module.exports = Search;
