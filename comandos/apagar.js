module.exports = {
  name: "apagar",

  async execute(message) {

    if (message.author.id !== message.guild.ownerId) {
      return message.reply("Só o dono pode usar.");
    }

    await message.reply("🛑 Limpando servidor...");

    // apagar canais
    for (const canal of message.guild.channels.cache.values()) {
      try {
        await canal.delete();
      } catch (err) {
        console.log(err);
      }
    }

    // apagar cargos
    const cargos = message.guild.roles.cache.filter(role =>
      role.editable &&
      role.name !== "@everyone"
    );

    for (const cargo of cargos.values()) {
      try {
        await cargo.delete();
      } catch (err) {
        console.log(err);
      }
    }
  }
};
