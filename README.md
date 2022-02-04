## NodeJS Discord VoiceChat Bot COMING SOON

[Invite](https://bit.ly/discord-tempvoice) | [Dicordserver / Support](https://bit.ly/discord-voicechatbot-support) | [SourceCode](https://bit.ly/discord-voicechatbot-repo)

#### This discordbot allows you to enable temporary voice channels at your server

---

### Requirements

-   Make sure you have nodejs >= v16.0.0 installed.
-   You need an available [Mongo Database](https://www.mongodb.com/) as a store for active voice chat channels and guild settings. Maybe host one [here](https://www.mongodb.com/cloud/atlas/)

-   if you want to use a great process manager to run your bot i would recommend [pm2](https://pm2.keymetrics.io/) ( a config for that is provided in the project )

---

#### Clone Repository and run the bot

-   > git clone git@github.com:LuciferMorningstarDev/discord-voicechatbot.git
-   > cd discord-voicechatbot/
-   Edit .env-example and save it as .env and configs/\*.json configurations
-   > npm install
-   If you want to use pm2 as your process manager
    -   > npm install -g pm2
    -   > pm2 start
-   If you run your bot with plain nodejs command
    -   > node bot.js
    -   OR
    -   > npm start

---

### Adding a new Language

If you want to add a new Language support you can easily add a new language.json file in the `./languages/` folder. Then you can translate all of the keys.
The files name should be in lowercase characters.

-   To use the language you need to restart the bot.
-   To set the language you can use the `/language` command.

---

If you want to have a new language supported in [our official bot](https://bit.ly/discord-tempvoice) create a fork / translate to a new language and then simply create a pull request. After some time and checking your request, the language will be active if everything is setup correctly.

---

discord-voicechatbot | Copyright (c) 2022 | [LuciferMorningstarDev](https://github.com/LuciferMorningstarDev) | Licensed under the MIT License

A copy of the LICENSE should be in project folder.
