const {
  ChannelType,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  name: "setup",

  async execute(message) {

    if (message.author.id !== message.guild.ownerId) {
      return message.reply("Só o dono pode usar.");
    }

    await message.reply("⚙️ Criando estrutura do servidor...");

    // =========================
    // ENTRADA
    // =========================

    const entrada = await message.guild.channels.create({
      name: "✈️ | Entrada",
      type: ChannelType.GuildCategory
    });

    await message.guild.channels.create({
      name: "💭・chat-morador",
      type: ChannelType.GuildText,
      parent: entrada.id
    });

    await message.guild.channels.create({
      name: "🛬・Entrada",
      type: ChannelType.GuildText,
      parent: entrada.id
    });

    await message.guild.channels.create({
      name: "🎟️・Invites",
      type: ChannelType.GuildText,
      parent: entrada.id
    });

    await message.guild.channels.create({
      name: "🛫・Saída",
      type: ChannelType.GuildText,
      parent: entrada.id
    });

    await message.guild.channels.create({
      name: "🚀・Booster",
      type: ChannelType.GuildText,
      parent: entrada.id
    });

    // =========================
    // SUPORTE
    // =========================

    const suporte = await message.guild.channels.create({
      name: "📩 | Suporte",
      type: ChannelType.GuildCategory
    });

    const suporteCanais = [
      "🗂️・ticket",
      "📘・tutorial",
      "📩・feedbacks"
    ];

    for (const nome of suporteCanais) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildText,
        parent: suporte.id
      });
    }

    // =========================
    // COMANDO CENTRAL
    // =========================

    const central = await message.guild.channels.create({
      name: "🏛️ | COMANDO CENTRAL",
      type: ChannelType.GuildCategory
    });

    const centralCanais = [
      "📢・avisos",
      "📋・regras-bate-ponto",
      "📊・bate-ponto",
      "📮・ranking-pontos",
      "📊・carga-horaria"
    ];

    for (const nome of centralCanais) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildText,
        parent: central.id
      });
    }

    // =========================
    // DIPLOMACIA
    // =========================

    const diplomacia = await message.guild.channels.create({
      name: "📜 | DIPLOMACIA",
      type: ChannelType.GuildCategory
    });

    const diplomaciaCanais = [
      "📖・Regras-Gerais",
      "🛡️・hierarquia-mas",
      "🛡️・hierarquia-fem",
      "🤝・aliados",
      "🛸・Parcerias",
      "📡・paredão-do-bahia"
    ];

    for (const nome of diplomaciaCanais) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildText,
        parent: diplomacia.id
      });
    }

    // =========================
    // LIDERANÇA
    // =========================

    const lideranca = await message.guild.channels.create({
      name: "⚜️ | Liderança",
      type: ChannelType.GuildCategory
    });

    const liderancaCanais = [
      "👑chat-liderança",
      "🛠️・gestão",
      "🎙️・reunião"
    ];

    for (const nome of liderancaCanais) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildText,
        parent: lideranca.id
      });
    }

    // =========================
    // GAMES
    // =========================

    const games = await message.guild.channels.create({
      name: "👾 | GAMES",
      type: ChannelType.GuildCategory
    });

    const gamesCanais = [
      "🎨・gartic",
      "💬・lord",
      "❌・jogo-da-velha",
      "🎮・uno"
    ];

    for (const nome of gamesCanais) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildText,
        parent: games.id
      });
    }

    // =========================
    // ÁREA DE LAZER
    // =========================

    const lazer = await message.guild.channels.create({
      name: "🎶 | AREA DE LAZER",
      type: ChannelType.GuildCategory
    });

    const lazerCanais = [
      "🎵・pedir-música"
    ];

    for (const nome of lazerCanais) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildText,
        parent: lazer.id
      });
    }

    const calls = [
      "🕌・Mesquita de Al-Aqsa",
      "🏛️・Muro das Lamentações",
      "🕹️・jogos",
      "🇮🇱・Rlk dos cangaceiros",
      "🎵・Música",
      "💑・casal",
      "💑・casal",
      "🎵・Música",
      "🎵・Música",
      "🗣️・Reunião"
    ];

    for (const nome of calls) {
      await message.guild.channels.create({
        name: nome,
        type: ChannelType.GuildVoice,
        parent: lazer.id
      });
    }

    message.channel.send("✅ Estrutura criada.");
  }
};
