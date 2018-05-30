const Command = require('../util/Command');
const { MessageEmbed } = require('discord.js');
const { ytapikey } = require('../config.json');
const ytapi = require('simple-youtube-api'); 
const handleVideo = require('../util/MusicHandling');
const youtube = new ytapi(ytapikey); 

class Play extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      usage: '-play <url|name|id>',
      description: 'This command plays a song using the bot',
      cooldown: 1,
      extended: 'This command plays a song from youtube using the bot, but you must be in the voice call to use this',
      category: 'Music'
    });
  }

  async run(message, args) {
    if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed('notDJ', message);
    if (!args.length) return this.client.embed('noArgs', message);
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed('noVoiceChannel', message);
    const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    const permissions = voiceChannel.permissionsFor(this.client.user).toArray();
    if (!permissions.includes('CONNECT')) return this.client.embed('noPerms-CONNECT', message);
    if (!permissions.includes('SPEAK')) return this.client.embed('noPerms-SPEAK', message);
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      const embed = new MessageEmbed()
        .setAuthor('Playlist')
        .setDescription(`✅ Playlist: **${playlist.title}** has been added to the queue!`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      message.channel.send(embed);
    } else {
      let video;
      try {
        video = await youtube.getVideo(url);
      } catch (error) {
        const videos = await youtube.searchVideos(args.join(' '), 1);
        if (!videos.length) return this.client.embed('noSongsFound', message, args);
        video = await youtube.getVideoByID(videos[0].id);   
      }
      return handleVideo(video, message, voiceChannel);
    }
  }
}

module.exports = Play;