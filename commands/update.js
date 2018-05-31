const Command = require('../util/Command.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

class Update extends Command {
  constructor(client) {
    super(client, {
      name: 'update',
      description: 'Updates the bots files by pulling from git, requires git cli to be installed',
      usage: 'update',
      aliases: ['pull', 'git', 'gitpull'],
      cooldown: 0,
      category: 'Owner'
    });
  }

  async run(message) {
    const { stdout, stderr, err } = await exec(`git pull ${require('../package.json').repository.url.split('+')[1]}`, { cwd: path.join(__dirname, '../') }).catch(err => ({ err }));
    if (err) this.client.log(err);
    const out = [];
    if (stdout) out.push(stdout);
    if (stderr) out.push(stderr);
    await message.channel.send(out.join('---\n'), { code: true });
    if (!stdout.toString().includes('Already up-to-date.') && (message.flags[0] === 'restart' || message.flags[0] === 'r')) {
      this.client.commands.get('reboot').run(message);
    }
  }
}


module.exports = Update;