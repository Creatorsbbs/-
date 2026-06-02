const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "dmall",

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Apenas administradores.");
        }

        const texto = args.join(" ");

        if (!texto) {
            return message.reply("❌ Informe a mensagem.");
        }

        const confirmEmbed = new EmbedBuilder()
            .setTitle("⚠️ Confirmação de Broadcast")
            .setDescription(
                `Deseja enviar esta mensagem para todos os membros?\n\n${texto}`
            )
            .setColor("Yellow");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("confirmar_dmall")
                .setLabel("Confirmar")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("cancelar_dmall")
                .setLabel("Cancelar")
                .setStyle(ButtonStyle.Danger)
        );

        const msg = await message.reply({
            embeds: [confirmEmbed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            time: 60000
        });

        collector.on("collect", async interaction => {

            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: "❌ Apenas quem executou o comando pode usar os botões.",
                    ephemeral: true
                });
            }

            if (interaction.customId === "cancelar_dmall") {

                collector.stop();

                return interaction.update({
                    content: "❌ Envio cancelado.",
                    embeds: [],
                    components: []
                });
            }

            if (interaction.customId === "confirmar_dmall") {

                await interaction.update({
                    content: "📨 Iniciando envio...",
                    embeds: [],
                    components: []
                });

                await message.guild.members.fetch();

                let enviados = 0;
                let falhas = 0;

                const dmEmbed = new EmbedBuilder()
                    .setTitle("📢 Aviso")
                    .setDescription(texto)
                    .setColor("Blue")
                    .setFooter({
                        text: message.guild.name
                    })
                    .setTimestamp();

                for (const [, membro] of message.guild.members.cache) {

                    if (membro.user.bot) continue;

                    try {
                        await membro.send({
                            embeds: [dmEmbed]
                        });

                        enviados++;

                    } catch {
                        falhas++;
                    }

                    await new Promise(r => setTimeout(r, 1000));
                }

                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("✅ Broadcast Finalizado")
                            .addFields(
                                {
                                    name: "📨 Enviados",
                                    value: `${enviados}`,
                                    inline: true
                                },
                                {
                                    name: "❌ Falhas",
                                    value: `${falhas}`,
                                    inline: true
                                }
                            )
                            .setColor("Green")
                    ]
                });

                collector.stop();
            }
        });
    }
};
