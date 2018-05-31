const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
const EnmapSQLite = require('enmap-sqlite');
const { token, defaultSettings } = require('./config.json');

const files = fs.readdirSync('./commands');
const events = fs.readdirSync('./events');
if (!files.length) throw Error('No command files found!');
if (!events.length) throw Error('No event files found!');
const jsfiles = files.filter(c => c.split('.').pop() === 'js');
const jsevents = events.filter(c => c.split('.').pop() === 'js');

class Client extends Discord.Client {
  constructor() {
    super();

    this.commands = new Discord.Collection();

    this.aliases = new Discord.Collection();

    this.playlists = new Discord.Collection();

    this.embed = require('./util/Embeds');

    this.settings = new Enmap({ provider: new EnmapSQLite({ name: 'settings' }) });


  }

  setGuildSettings(id, obj) {
    return this.settings.set(id, obj);
  }

  addGuildSettings(name, val) {
    this.guilds.forEach(c => {
      const id = c.id;
      const current = this.settings.get(id);
      current[name] = val;
      this.settings.set(id, current);
    });
  }

  removeGuildSettings(id, name) {
    const current = this.settings.get(id);
    delete current[name];
    this.settings.set(id, current);
  }

  setDefaultGuildSettings(id) {
    this.settings.set(id, defaultSettings);
  }

  setPropSettings(id, name, val) {
    const current = this.settings.get(id);
    current[name] = val;
    this.settings.set(id, current);
  }

  log(message) {
    console.log(`[${new Date().toLocaleString()}] > ${message}`);
  }
}

const client = new Client();

for (let i = 0; i < jsfiles.length; i++) {
  if (!jsfiles.length) throw Error('No javascript command files found!');
  const file = require(`./commands/${jsfiles[i]}`);
  const command = new file(client);
  if (typeof command.run !== 'function') throw Error(`No run function found in ${jsfiles[i]}`);
  client.commands.set(command.name, command);
  client.log(`Command loaded: ${command.name} `);
  if (command && command.aliases && command.aliases.constructor.name === 'Array') {
    for (let i = 0; i < command.aliases.length; i++) {
      client.aliases.set(command.aliases[i], command);
    }
  }
}

for (let i = 0; i < jsevents.length; i++) {
  if (!jsevents.length) throw Error('No javascript event files found!');
  const file = require(`./events/${jsevents[i]}`);
  const event = new file(client, file);
  client.log(`Event loaded: ${event.name}`);
  if (typeof event.run !== 'function') throw Error(`No run function found in ${jsevents[i]}`);
  client.on(jsevents[i].split('.')[0], (...args) => event.run(...args));
}

client.login(token);

process.on('unhandledRejection', err => client.log(err));