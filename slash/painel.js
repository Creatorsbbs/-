const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Abre painel de tickets"),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("🎫 Tickets")
      .setDescription("Clique para abrir um ticket")
      .setColor("#3aa3e7");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_suporte")
        .setLabel("Suporte")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("ticket_vendas")
        .setLabel("Vendas")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
