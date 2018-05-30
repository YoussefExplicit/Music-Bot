const Command = require('../util/Command.js');
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const { post } = require('snekfetch');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      usage: 'eval <expression>',
      aliases: ['ev'],
      cooldown: 0,
      category: 'Owner'
    });
  }

  async run(message, args) {
    const code = args.join(' ');
    const token = this.client.token.split('').join('[^]{0,2}');
    const rev = this.client.token.split('').reverse().join('[^]{0,2}');
    const filter = new RegExp(`${token}|${rev}`, 'g');
    try {
      let output = eval(code);
      if (message.flags.includes('s') || message.flags.includes('silent')) return;
      if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, '[TOKEN]');
      output = clean(output);
      if (output.length < 1000) {
        const embed = new MessageEmbed()
          .addField('Input 📥', `\`\`\`js\n${code}\`\`\``)
          .addField('Output 📤', `\`\`\`js\n${output}\`\`\``)
          .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
        message.channel.send(embed);
      } else {
        try {
          const { body } = await post('https://www.hastebin.com/documents').send(output);
          const embed = new MessageEmbed()
            .setTitle('Output was too long, uploaded to hastebin!')
            .setURL(`https://www.hastebin.com/${body.key}.js`)
            .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
          message.channel.send(embed);
        } catch (error) {
          message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch (error) {
      message.channel.send(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
    }
  }
}


function clean(text) {
  return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203));
}

module.exports = Eval;