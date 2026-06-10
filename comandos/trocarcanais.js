const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "trocarcanais",

  async execute(message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Você precisa ser administrador.");
    }

    const antigo = args[0];
    const novo = args[1];

    if (!antigo || !novo) {
      return message.reply(
        "Use: !trocarcanais <texto_antigo> <texto_novo>"
      );
    }

    let alterados = 0;

    for (const [, canal] of message.guild.channels.cache) {

      if (!canal.name) continue;

      if (canal.name.includes(antigo)) {

        const novoNome = canal.name.replaceAll(antigo, novo);

        try {
          await canal.setName(novoNome);
          alterados++;
        } catch (err) {
          console.log(err);
        }
      }
    }

    message.reply(
      `✅ ${alterados} canais foram atualizados.`
    );
  }
};
