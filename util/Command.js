module.exports = class Command {
  constructor(client, options) {

    this.client = client;

    this.name = options.name;

    this.usage = options.usage ||	'No usage provided';

    this.description = options.description ||	'No description provided';

    this.extended = options.extended ||	'No extended description provided';

    this.aliases = options.aliases ||	'No aliases for this certain command';

    this.category = options.category || null;

    this.cooldown = options.cooldown || 3;

  }

  reload() {
    const path = `../commands/${this.name}.js`;
    delete require.cache[path];
    const command = require(`../commands/${this.name}.js`);
    this.client.commands.set(command);
    this.client.aliases.set(command.aliases);
  }
};