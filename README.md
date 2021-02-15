# Music Bot - By Youssef

This a music bot crafted in discord.js master, a discord api wrapper. So far, this plays music from youtube, and youtube only. 

# How to host:

1. Clone this repository.
2. Install all of the npm modules by running: `npm i`.
3. Install node-opus or opusscript, and ffmpeg, by also running `npm i ffmpeg-binaries node-opus`.
4. Create a file called config.json, make sure it looks like this:

```json
{
  "token": "BOT TOKEN HERE",
  "ytapikey": "YOUTUBE API KEY",
  "ownerid": "YOUR ID",
  "defaultSettings": {
    "prefix": "-",
    "ratelimit": false,
    "djonly": false,
    "djrole": "dj",
    "maxqueuelength": 20
  }
}
```
5. Save it and run it using `node index.js` or `nodemon index.js` or `pm2 start index.js`

This will be updated over time, so ensure to update your own version alongside mine to ensure that all of the files are up to date. If you want to make a pull request, go for it and ensure you include all of the information necessary and describe it as much as you could. "# Music-Bot" 

I've got to give some credit to York from An Idiot's Guide. This command handler was inspired by his from Misaki, an anime based bot which could be found [here](https://github.com/NotAWeebDev/Misaki).
[![Run on Repl.it](https://repl.it/badge/github/YoussefExplicit/Music-Bot)](https://repl.it/github/YoussefExplicit/Music-Bot)