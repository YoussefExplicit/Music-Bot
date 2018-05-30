const Command = require('../util/Command.js');
const { MessageEmbed } = require('discord.js');
 
class Settings extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      description: 'This command will force the bot to leave your current call',
      usage: 'set <prop> <value>',
      aliases: ['set', 'config'],
      cooldown: 3,
      category: 'Administrator'
    });
  }

  run(message, [prop, ...value]) { 
    if (!prop && !value.length) {
      const embed = new MessageEmbed()
        .setAuthor('Settings ⚙')
        .setThumbnail('https://invisible.io/wp-content/themes/invisible/assets/img/animation.png')
        .setColor(message.guild.me.roles.highest.color);
      for (const prop in message.settings) {
        const value = message.settings[prop];
        embed.addField(prop, value, true);
      }
      return message.channel.send(embed);
    }
    if (prop && !value && message.settings[prop]) {
      return message.reply(`${prop}'s value: ${message.settings[prop]}`);
    } else if (prop && value && message.settings[prop]) {
      if (!message.settings[prop]) message.reply('Invalid value!');
      value = value.join(' ').toLowerCase();
      if (value === 'true' ||	value === 'false') value = value === 'true';
      if (!isNaN(Number(value))) value === Number(value);
      this.client.setPropSettings(message.guild.id, prop, value);
      return message.channel.send(`Set ${prop}'s value to equal \`${value}\``);
    } else {
      return message.reply('Invalid value!');
    }
  }
}

module.exports = Settings;