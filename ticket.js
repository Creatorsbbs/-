const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType
} = require("discord.js");

module.exports = {
  name: "ticket",

  async execute(message, args) {

    // Apenas administrador
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Você precisa ser administrador.");
    }

    // =========================
    // PAINEL
    // =========================

    const painel = new EmbedBuilder()
      .setTitle("🎫 Central de Atendimento")
      .setDescription(
        "Clique no botão abaixo para abrir um ticket."
      )
      .setColor("#2b2d31")
      .setFooter({
        text: message.guild.name
      });

    const botoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("abrir_ticket")
        .setLabel("Abrir Ticket")
        .setEmoji("🎫")
        .setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({
      embeds: [painel],
      components: [botoes]
    });

    // =========================
    // INTERAÇÃO
    // =========================

    const collector = message.channel.createMessageComponentCollector();

    collector.on("collect", async (interaction) => {

      // =========================
      // ABRIR TICKET
      // =========================

      if (interaction.customId === "abrir_ticket") {

        const ticketExistente = interaction.guild.channels.cache.find(
          c => c.name === `ticket-${interaction.user.id}`
        );

        if (ticketExistente) {
          return interaction.reply({
            content: `❌ Você já possui um ticket: ${ticketExistente}`,
            ephemeral: true
          });
        }

        const canal = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,

          type: ChannelType.GuildText,

          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                PermissionsBitField.Flags.ViewChannel
              ]
            },

            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]
        });

        const embedTicket = new EmbedBuilder()
          .setTitle("🎫 Ticket Aberto")
          .setDescription(
            `Olá ${interaction.user}, descreva seu problema.\n\nA equipe responderá em breve.`
          )
          .setColor("Green");

        const fecharBotao = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("fechar_ticket")
            .setLabel("Fechar Ticket")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger)
        );

        await canal.send({
          content: `${interaction.user}`,
          embeds: [embedTicket],
          components: [fecharBotao]
        });

        await interaction.reply({
          content: `✅ Seu ticket foi criado: ${canal}`,
          ephemeral: true
        });
      }

      // =========================
      // FECHAR TICKET
      // =========================

      if (interaction.customId === "fechar_ticket") {

        await interaction.reply({
          content: "🔒 Fechando ticket em 5 segundos..."
        });

        setTimeout(() => {
          interaction.channel.delete().catch(() => {});
        }, 5000);
      }

    });

  }
};
