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
    GatewayIntentBits.GuildMembers,
  ],
});

// Bot online
client.once("clientReady", () => {
  console.log(`${client.user.tag} ficou online.`);
});


// =====================
// SISTEMA DE COMANDOS
// =====================

const fs = require("fs");

client.commands = new Map();

const commandFiles = fs
  .readdirSync("./comandos")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./comandos/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Ping
  if (message.content === "!ping") {
    return message.reply("Pong!");
  }

  const prefix = "-";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("Erro ao executar comando.");
  }
});

// Login
client.login(process.env.TOKEN);
