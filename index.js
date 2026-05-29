
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();

// Porta do Render
const PORT = process.env.PORT || 3000;

// Página simples pra UptimeRobot pingar
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

client.once("ready", () => {
  console.log(`${client.user.tag} ficou online.`);
});

// Exemplo de comando
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("Pong!");
  }
});

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();

// Porta do Render
const PORT = process.env.PORT || 3000;

// Página simples pra UptimeRobot pingar
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

client.once("ready", () => {
  console.log(`${client.user.tag} ficou online.`);
});

// Comando ping
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("Pong!");
  }
});

// COMANDO DE LIMPEZA
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "-apagar") {

    // Só o dono do servidor pode usar
    if (message.author.id !== message.guild.ownerId) {
      return message.reply("Só o dono do servidor pode usar.");
    }

    await message.reply("🛑 Limpando servidor...");

    // APAGAR CANAIS
    const canais = message.guild.channels.cache;

    for (const canal of canais.values()) {
      try {
        await canal.delete();
      } catch (err) {}
    }

    // APAGAR CARGOS
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

client.login(process.env.TOKEN);
