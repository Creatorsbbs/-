const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  PermissionsBitField
} = require("discord.js");

const fs = require("fs");

const dbFile = "./tickets.json";

function loadDB() {
  if (!fs.existsSync(dbFile)) return {};
  return JSON.parse(fs.readFileSync(dbFile));
}

function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = (client) => {

  client.on("interactionCreate", async (interaction) => {

    let db = loadDB();

    // ===================== /ticket setup =====================
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "ticket") {

        if (interaction.options.getSubcommand() === "setup") {

          if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {};
          }

          const embed = new EmbedBuilder()
            .setTitle("⚙️ Setup Ticket Upgrade")
            .setDescription("Configure seu sistema abaixo:")
            .setColor("Blue");

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("set_title").setLabel("Título").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("set_desc").setLabel("Descrição").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("set_thumb").setLabel("Thumbnail").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("set_banner").setLabel("Banner").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("set_role").setLabel("Cargo Suporte").setStyle(ButtonStyle.Success)
          );

          await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }
      }
    }

    // ===================== BOTÕES SETUP =====================
    if (interaction.isButton()) {

      let db = loadDB();
      if (!db[interaction.guild.id]) db[interaction.guild.id] = {};

      // exemplo simples (sem modal pra não complicar)
      if (interaction.customId === "set_title") {
        db[interaction.guild.id].title = "🎫 Suporte";
        saveDB(db);
        return interaction.reply({ content: "Título definido!", ephemeral: true });
      }

      if (interaction.customId === "set_desc") {
        db[interaction.guild.id].desc = "Abra seu ticket abaixo.";
        saveDB(db);
        return interaction.reply({ content: "Descrição definida!", ephemeral: true });
      }

      if (interaction.customId === "set_thumb") {
        db[interaction.guild.id].thumb = "https://i.imgur.com/example.png";
        saveDB(db);
        return interaction.reply({ content: "Thumbnail definida!", ephemeral: true });
      }

      if (interaction.customId === "set_banner") {
        db[interaction.guild.id].banner = "https://i.imgur.com/example.png";
        saveDB(db);
        return interaction.reply({ content: "Banner definido!", ephemeral: true });
      }

      if (interaction.customId === "set_role") {
        db[interaction.guild.id].role = interaction.member.roles.highest.id;
        saveDB(db);
        return interaction.reply({ content: "Cargo suporte definido!", ephemeral: true });
      }

      // ===================== ABRIR TICKET =====================
      if (interaction.customId === "ticket_open") {

        const config = db[interaction.guild.id] || {};

        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            },
            ...(config.role ? [{
              id: config.role,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            }] : [])
          ]
        });

        const embed = new EmbedBuilder()
          .setTitle(config.title || "🎫 Ticket")
          .setDescription(config.desc || "Explique seu problema.")
          .setColor("Blue")
          .setThumbnail(config.thumb || null)
          .setImage(config.banner || null);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Fechar")
            .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
            .setCustomId("ticket_claim")
            .setLabel("Assumir")
            .setStyle(ButtonStyle.Success)
        );

        return channel.send({
          content: `<@${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });
      }

      // ===================== FECHAR =====================
      if (interaction.customId === "ticket_close") {

        try {
          await interaction.user.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("📩 Ticket fechado")
                .setDescription("Seu ticket foi encerrado com sucesso.")
                .setColor("Red")
            ]
          });
        } catch {}

        await interaction.reply("🔒 Fechando ticket...");
        setTimeout(() => interaction.channel.delete(), 2500);
      }

      // ===================== ASSUMIR =====================
      if (interaction.customId === "ticket_claim") {
        return interaction.reply({
          content: `👮 Ticket assumido por <@${interaction.user.id}>`,
          allowedMentions: { users: [] }
        });
      }
    }

    // ===================== MENU =====================
    if (interaction.isStringSelectMenu()) {

      if (interaction.customId === "ticket_select") {

        const type = interaction.values[0];

        const channel = await interaction.guild.channels.create({
          name: `ticket-${type}-${interaction.user.username}`,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            }
          ]
        });

        const embed = new EmbedBuilder()
          .setTitle(`🎫 Ticket - ${type}`)
          .setDescription("Explique seu problema.")
          .setColor("Blue");

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Fechar")
            .setStyle(ButtonStyle.Danger)
        );

        return channel.send({
          content: `<@${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });
      }
    }
  });
};
