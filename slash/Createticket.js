module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Sistema de tickets")
    .addSubcommand(sub =>
      sub
        .setName("setup")
        .setDescription("Criar painel de ticket")
    ),

  async execute(interaction) {

    if (interaction.options.getSubcommand() === "setup") {

      const embed = new EmbedBuilder()
        .setTitle("🎫 Sistema de Ticket")
        .setDescription("Clique para abrir um ticket")
        .setColor("Blue");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket_open")
          .setLabel("Abrir Ticket")
          .setStyle(ButtonStyle.Success)
      );

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }
};
