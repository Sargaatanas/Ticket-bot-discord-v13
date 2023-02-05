// Create by me

const { Client } = require("discord.js");
const { token, guildId } = require("./settings");

const client = new Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

client.on("ready", async() => {
    console.log(`${client.user.username} est en ligne`);
    let guild = client.guilds.cache.get(guildId);
    if (guild) {
        await guild.commands.set([{
                name: "ping",
                description: `Just a test`,
                type: "CHAT_INPUT",
            },
            {
                name: "setup",
                description: `Create a panel for ticket`,
                type: "CHAT_INPUT",
            },
        ]);
    }

    require("./ticket")(client);
});

client.login(token);
