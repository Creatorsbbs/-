const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message) {

    if (message.author.bot) return;
    if (!message.guild) return;

    // Ignora administradores
    if (
      message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) return;

    const regex =
      /(discord\.gg\/|discord\.com\/invite\/|discordapp\.com\/invite\/)/i;

    if (regex.test(message.content)) {

      await message.delete().catch(() => {});

      await message.channel.send({
        content: `${message.author}, convites de outros servidores não são permitidos.`
      })
      .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    }
  }
};
