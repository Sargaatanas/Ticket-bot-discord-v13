// Create by me ( Sargaatanas )

const {
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Modal,
    TextInputComponent,
} = require("discord.js");
const settings = require("./settings");

/**
 *
 * @param {Client} client
 */
module.exports = async(client) => {

        client.on("interactionCreate", async(interaction) => {
                    if (interaction.isCommand()) {
                        if (interaction.commandName == "ping") {
                            return interaction.reply({
                                content: `> Pong :: ${client.ws.ping}`,
                            });
                        } else if (interaction.commandName == "setup") {
                            let ticketChannel = interaction.guild.channels.cache.get(
                                settings.ticketChannel
                            );
                            if (!ticketChannel) return;

                            let embed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`ServerName - Ticket`)
                                .setDescription(`> Create a ticket and specify the problem.`);

                            let btnrow = new MessageActionRow().addComponents([
                                new MessageButton()
                                .setCustomId("ticket_create")
                                .setStyle("SECONDARY")
                                .setLabel(`Create ticket`)
                                .setEmoji("🎟️"),
                            ]);
                            await ticketChannel.send({
                                embeds: [embed],
                                components: [btnrow],
                            });

                            interaction.reply({
                                content: `Ticket in ${ticketChannel}`,
                            });
                        }
                    }

                    if (interaction.isButton()) {
                        if (interaction.customId == "ticket_create") {
                            const ticket_modal = new Modal()
                                .setTitle("Ticket System")
                                .setCustomId("ticket_modal");

                            const user_name = new TextInputComponent()
                                .setCustomId("ticket_username")
                                .setLabel(`Budget`.substring(0, 45))
                                .setMinLength(3)
                                .setMaxLength(50)
                                .setRequired(true)
                                .setStyle("SHORT");

                            const user_reason = new TextInputComponent()
                                .setCustomId("ticket_reason")
                                .setLabel(`Specify the problem`.substring(0, 45))
                                .setMinLength(1)
                                .setMaxLength(100)
                                .setRequired(true)
                                .setStyle("PARAGRAPH");

                            const row_username = new MessageActionRow().addComponents(user_name);
                            const row_user_reason = new MessageActionRow().addComponents(
                                user_reason
                            );
                            ticket_modal.addComponents(row_username, row_user_reason);

                            await interaction.showModal(ticket_modal);
                        } else if (interaction.customId == "ticket_delete") {
                            let ticketname = `ticket-${interaction.user.id}`;
                            let oldChannel = interaction.guild.channels.cache.find(
                                (ch) => ch.name == ticketname
                            );
                            if (!oldChannel) return;
                            interaction.reply({
                                content: `> Your ticket delete in 5 seconds.`,
                            });
                            setTimeout(() => {
                                oldChannel.delete().catch((e) => {});
                            }, 5000);
                        }
                    }

                    if (interaction.isModalSubmit()) {
                        const ticket_username =
                            interaction.fields.getTextInputValue("ticket_username");
                        const ticket_user_reason =
                            interaction.fields.getTextInputValue("ticket_reason");

                        let ticketname = `ticket-${interaction.user.id}`;
                        await interaction.guild.channels
                            .create(ticketname, {
                                type: "GUILD_TEXT",
                                topic: `Ticket of ${interaction.user.tag}`,
                                parent: settings.ticketCategory || interaction.channel.parentId,
                                permissionOverwrites: [{
                                        id: interaction.guildId,
                                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                    },
                                    {
                                        id: interaction.user.id,
                                        allow: [
                                            "VIEW_CHANNEL",
                                            "SEND_MESSAGES",
                                            "READ_MESSAGE_HISTORY",
                                            "EMBED_LINKS",
                                            "ATTACH_FILES",
                                            "MANAGE_CHANNELS",
                                            "ADD_REACTIONS",
                                            "USE_APPLICATION_COMMANDS",
                                        ],
                                    },
                                    {
                                        id: client.user.id,
                                        allow: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
                                    },
                                ],
                            })
                            .then(async(ch) => {
                                    let embed = new MessageEmbed()
                                        .setColor("BLURPLE")
                                        .setTitle(`Ticket of ${interaction.user.username}`)
                                        .addFields([{
                                                name: `?`,
                                                value: `> ${ticket_username}`,
                                            },
                                            {
                                                name: `?`,
                                                value: `> ${ticket_user_reason}`,
                                            },
                                        ]);

                                    let btnrow = new MessageActionRow().addComponents([
                                        new MessageButton()
                                        .setCustomId(`ticket_delete`)
                                        .setStyle("DANGER")
                                        .setLabel(`Supprimer`),
                                    ]);
                                    ch.send({
                                                content: `${interaction.member} || ${settings.ticketRoles.map(
                (r) => `<@&${r}>`
              )}`,
              embeds: [embed],
              components: [btnrow],
            });
            interaction.reply({
              content: `> Your ticket are in ${ch}`,
              ephemeral: true,
            });
          })
          .catch((e) => {
            interaction.reply({
              content: `Error \n \`${e.message}\``,
              ephemeral: true,
            });
          });
      }
    });
  };
