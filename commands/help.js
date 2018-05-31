const Command = require('../util/Command.js');
const { MessageEmbed } = require('discord.js');

const EMOJIS = ['⏮', '◀', '⏹', '▶', '⏭', '🔢'];
const perpage = 10;

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Get help on a command or a command category,',
      category: 'System',
      usage: 'help <category/command> [page-num]',
      cooldown: 5,
      aliases: ['h', 'halp', 'commands']
    });
  }

  async run(message, [type, page=1]) {
    let num = 0;    
    if (type) type = type.toLowerCase();
    const helpembed = new MessageEmbed()
      .setTimestamp()
      .setColor(message.guild.me.roles.highest.color || 0x00AE86)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
  
    const sorted = this.client.commands.filter(c => c.category !== 'Owner');

    if (!type) {
      let output = '';
      const pg = Number(page);
      for (const cmd of sorted.values()) {
        if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
          output += `\n\`${message.settings.prefix + cmd.name}\` | ${cmd.description.length > 80 ? `${cmd.description.slice(0, 80)}...` : cmd.description}`;
        }
        num++;
      }
    
      if (num) {
        helpembed.setTitle(`Page ${page}/${Math.ceil(num / perpage)}`)
          .addField('Commands', output);
      }
    }
    if (this.client.commands.has(type) || this.client.aliases.has(type)) {
      const cm = this.client.commands.get(type) || this.client.aliases.get((type));
      helpembed.setTitle(cm.name)
        .addField('Command Description', cm.description)
        .addField('Extended Description', cm.extended)
        .addField('Command Usage', `\`${cm.usage}\``)
        .addField('Command Aliases', cm.aliases.constructor.name === 'String' ? cm.aliases : cm.aliases.join(', '));
    }
    if (!helpembed.description && !helpembed.fields.length) return;
    const msg2 = await message.channel.send(helpembed);
    const totalpages = Math.ceil(num / perpage);
    if (!message.guild.me.hasPermission(['MANAGE_MESSAGES'])) {
      await message.channel.send('I don\'t have permission to remove reactions, please do this manually.');
    }
  
    if (msg2.embeds[0].title && msg2.embeds[0].title.includes('Page') && totalpages > 1) {
      for (const emoji of EMOJIS) await msg2.react(emoji);
    }
  
    const select = msg2.createReactionCollector(
      (reaction, user) => EMOJIS.includes(reaction.emoji.name) && user.id === message.author.id,
      { time: 30000 }
    );
  
    let on = false;
    select.on('collect', async (r) => {
      const currentpage = Number(msg2.embeds[0].title.split(' ')[1].split('/')[0]);
      switch (r.emoji.name) {
        case '▶':
          pages(message, msg2, currentpage + 1, sorted, r, 'forward');
          break;
        case '◀':
          pages(message, msg2, currentpage - 1, sorted, r, 'backward');
          break;
        case '⏮':
          pages(message, msg2, 1, sorted, r);
          break;
        case '⏭':
          pages(message, msg2, totalpages, sorted, r);
          break;
        case '⏹':
          select.stop();
          r.message.reactions.removeAll();
          break;
        case '🔢': {
          if (on) return;
          on = true;
          await r.message.channel.send(`Please enter a selection from 1 to ${totalpages}`);
          const whichpage = await message.channel.awaitMessages(m => !isNaN(m.content) && m.author.id === message.author.id && Number(m.content) <= totalpages && Number(m.content) > 0, {
            max: 1,
            time: 300000,
            errors: ['time']
          });
          const pagenumber = Number(whichpage.first().content);
          pages(message, msg2, pagenumber, sorted, r);
          on = false;
          break;
        }
      }
    });
  
    select.on('end', (r, reason) => {
      if (reason === 'time') {
        msg2.reactions.removeAll();
      }
    });
  }
}

module.exports = Help;

String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s) {
      return s.toUpperCase(); 
    });
};

Array.prototype.unique = function() {
  return this.filter((x, i, a) => a.indexOf(x) == i);
};

async function pages(message, helpmessage, pagenumber, sorted, reactions, direction) {
  let num = 0;
  let output = '';
  const pg = Number(pagenumber);
  for (const cmd of sorted.values()) {
    if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
      output += `\n\`${message.settings.prefix + cmd.name}\` | ${cmd.description.length > 80 ? `${cmd.description.slice(0, 80)}...` : cmd.description}`;
    }
    num++;
  }
  reactions.users.remove(message.author);
  if (direction === 'forward' && pg > Math.ceil(num / perpage)) return;
  if (direction === 'backward' && pg === 0) return;
  const helpembed = new MessageEmbed()
    .setTitle(`Page ${pg}/${Math.ceil(num / perpage)}`)
    .addField('Commands', output)
    .setColor(message.guild.me.roles.highest.color || 5198940)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
  await helpmessage.edit(helpembed);
}