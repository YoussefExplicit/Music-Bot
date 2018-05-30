const Command = require('../util/Command.js');
const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Reboots the bot if running on pm2 or nodemon',
      usage: 'reboot',
      aliases: ['restart'],
      cooldown: 0,
      category: 'Owner'
    });
  }

  async run(message) {
    const m = await message.channel.send('Rebooting the bot, please wait...');
    await writeFile('./data/reboot.json', `{ "messageID": "${m.id}", "channelID": "${m.channel.id}" }`);
    process.exit(1);
  }
}


module.exports = Reboot;