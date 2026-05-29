const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();

// Porta do Render
const PORT = process.env.PORT || 3000;

// Página simples
app.get("/", (req, res) => {
  res.send("Bot online.");
});

app.listen(PORT, () => {
  console.log(`Site rodando na porta ${PORT}`);
});

// Cliente Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Bot online
client.once("clientReady", () => {
  console.log(`${client.user.tag} ficou online.`);
});

// Comandos
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Ping
  if (message.content === "!ping") {
    return message.reply("Pong!");
  }

  // Apagar tudo
  if (message.content === "-apagar") {

    // Só dono
    if (message.author.id !== message.guild.ownerId) {
      return message.reply("Só o dono do servidor pode usar.");
    }

    await message.reply("🛑 Limpando servidor...");

    // Apagar canais
    for (const canal of message.guild.channels.cache.values()) {
      try {
        await canal.delete();
      } catch (err) {}
    }

    // Apagar cargos
    const cargos = message.guild.roles.cache.filter(role =>
      role.editable &&
      role.name !== "@everyone"
    );

    for (const cargo of cargos.values()) {
      try {
        await cargo.delete();
      } catch (err) {}
    }
  }
});

// Login
client.login(process.env.TOKEN);
