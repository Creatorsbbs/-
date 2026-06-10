const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Sistema de tickets do servidor")
    .addSubcommand(sub =>
      sub
        .setName("setup")
        .setDescription("Configurar o painel de tickets")
    ),

  async execute(interaction) {
    const ticket = require("../ticket"); // chama seu sistema principal

    if (interaction.options.getSubcommand() === "setup") {
      return ticket.setup(interaction);
    }
  }
};
