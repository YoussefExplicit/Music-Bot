const Event = require('../util/Event.js');
const { MessageEmbed } = require('discord.js');
const { Collection } = require('discord.js');
const moment = require('moment');
const { ownerid } = require('../config.json');
require('moment-duration-format');

class Message extends Event {
  constructor(...args) {
    super(...args);

    this.ratelimits = new Collection();
  }

  async run(message) {
    if (message.channel.type === 'dm') return message.channel.send('Commands are disabled in DMs.');
    message.settings = this.client.settings.get(message.guild.id);
    const prefixMention = new RegExp(`^<@!?${this.client.user.id}> `);
    const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : message.settings.prefix;
    if (!message.content.startsWith(prefix)) return;
    message.flags = [];
    const args = message.content.split(' ');
    let command;
    if (message.content.startsWith('<')) {
      args.shift();
      command = args.shift().toLowerCase();
    } else {
      command = args.shift().toLowerCase().substring(prefix.length);
    }
    while (args[0] && args[0].split('')[0] === '-') message.flags.push(args.shift().slice(1));
    if (this.client.commands.has(command)) {
      const cmd = this.client.commands.get(command);
      if (message.settings.ratelimit) {
        const rateLimit = this.ratelimit(message, cmd);
        if (typeof rateLimit === 'string') {
          const embed = new MessageEmbed()
            .setAuthor('Ratelimit')
            .setDescription(`Please wait ${rateLimit.toPlural()} before running \`${command}\` again`)
            .setColor(message.guild.me.roles.highest.color)
            .setTimestamp();
          return message.channel.send(embed);
        }
      }
      if (cmd.category === 'Owner' && message.author.id !== ownerid) return;
      if (cmd.category === 'Administrator' && message.member.permissions.has('ADMINISTRATOR')) return;

      this.client.log(`CMD RUN: ${message.author.tag} (${message.author.id}) used command: ${cmd.name}`);
      await cmd.run(message, args);
    } else if (this.client.aliases.has(command)) {
      const cmd = this.client.aliases.get(command);
      if (message.settings.ratelimit) {
        const rateLimit = this.ratelimit(message, cmd);
        if (typeof rateLimit === 'string') {
          const embed = new MessageEmbed()
            .setAuthor('Ratelimit')
            .setDescription(`Please wait ${rateLimit.toPlural()} before running \`${command}\` again`)
            .setColor(message.guild.me.roles.highest.color)
            .setTimestamp();
          return message.channel.send(embed);
        }
      }
      this.client.log(`CMD RUN: ${message.author.tag} (${message.author.id}) used command: ${cmd.name}`);
      await cmd.run(message, args);
    } else return;
  }


  ratelimit(message, cmd) {
    if (message.member.permissions.has('ADMINISTRATOR') || message.author.id === ownerid) return false;

    const cooldown = cmd.cooldown * 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {}; 
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown; 
    const difference = Date.now() - ratelimits[cmd.name]; 
    if (difference < cooldown) { 
      return moment.duration(cooldown - difference).format('D [days], H [hours], m [minutes], s [seconds]', 1);
    } else {
      ratelimits[cmd.name] = Date.now();
      this.ratelimits.set(message.author.id, ratelimits); 
      return true;
    }
  }
}

module.exports = Message;

String.prototype.toPlural = function() {
  return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
};