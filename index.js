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

require("./slashCommands")(client);

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // FECHAR TICKET
  if (interaction.customId === "fechar_ticket") {

    await interaction.reply({
      content: "🔒 Fechando ticket em 5 segundos..."
    });

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);

    return;
  }

  // NOTIFICAR CLIENTE
  if (interaction.customId === "notificar_cliente") {

    const id = interaction.channel.name.split("-").pop();

    const usuario = await interaction.guild.members
      .fetch(id)
      .catch(() => null);

    if (!usuario) {
      return interaction.reply({
        content: "❌ Usuário não encontrado.",
        ephemeral: true
      });
    }

    try {

      await usuario.send({
        embeds: [
          {
            title: "📩 Ticket Atualizado",
            description:
              `Olá ${usuario.user}, a equipe respondeu seu ticket.\n\nVolte ao servidor para verificar.`,
            color: 0x5865F2
          }
        ]
      });

      await interaction.reply({
        content: "✅ Cliente notificado.",
        ephemeral: true
      });

    } catch {

      await interaction.reply({
        content: "❌ Não consegui enviar mensagem no privado.",
        ephemeral: true
      });

    }
  }
});

// Login
client.login(process.env.TOKEN);
