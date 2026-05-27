// Comando: /apagarcanais
// Discord.js v14

const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apagarcanais")
    .setDescription("Apaga todos os canais do servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    // Verifica se é administrador
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ Você precisa ser administrador.",
        ephemeral: true
      });
    }

    await interaction.reply("🗑️ Apagando todos os canais...");

    interaction.guild.channels.cache.forEach(async (channel) => {
      try {
        await channel.delete();
      } catch (err) {
        console.log(`Erro ao apagar ${channel.name}`);
      }
    });

  }
};
