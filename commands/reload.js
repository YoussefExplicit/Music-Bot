const Command = require('../util/Command.js');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      description: 'Reloads a command instead of restarting the bot',
      usage: 'r <command>',
      aliases: ['r'],
      cooldown: 0,
      category: 'Owner'
    });
  }

  async run(message, args) {
    const command = this.client.commands.has(args[0]) ? this.client.commands.get(args[0]) : (this.client.aliases.has(args[0]) ? this.client.aliases.get(args[0]) : null);  
    if (command) {
      try {
        await command.reload();
        message.channel.send('Successfully reloaded command: ' + args[0]);
      } catch (e) {
        message.channel.send('Error : ' + e.stack);
      }
    } else {
      message.channel.send('Invalid file!');
    }
  }
}


module.exports = Reload;