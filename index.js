// Créer par BaalZephon#1533
// discord.gg/rowsfield

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
                description: `test le ping du bot`,
                type: "CHAT_INPUT",
            },
            {
                name: "setup",
                description: `créer le support ticket`,
                type: "CHAT_INPUT",
            },
        ]);
    }

    require("./ticket")(client);
});

client.login(token);