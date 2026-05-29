
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

client.login(process.env.TOKEN);
