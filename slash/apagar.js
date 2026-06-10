const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apagar")
    .setDescription("Apaga mensagens")
    .addIntegerOption(option =>
      option
        .setName("quantidade")
        .setDescription("Quantidade de mensagens")
        .setRequired(true)
    ),

  async execute(interaction) {

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "❌ Você não tem permissão.",
        ephemeral: true
      });
    }

    const quantidade =
      interaction.options.getInteger("quantidade");

    await interaction.channel.bulkDelete(
      quantidade,
      true
    );

    await interaction.reply({
      content: `✅ ${quantidade} mensagens apagadas.`,
      ephemeral: true
    });
  }
};
