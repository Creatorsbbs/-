const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

// ================= CONFIG =================
const extraRoles = [
  "1491095314550100100",
  "1491095311383527630",
  "1491095310351597698",
  "1491095309508546742",
  "1494862321481416834"
];

// ================= MEMORY =================
const ticketOwners = new Map();
const ticketData = new Map();

// ================= SETUP SERVIDOR =================
async function setupServer(guild) {
  try {
    let staffRoleId = await db.get(`staffRole_${guild.id}`);

    let staffRole = staffRoleId
      ? await guild.roles.fetch(staffRoleId).catch(() => null)
      : null;

    // ================= ABERTOS =================
    let openLogs = guild.channels.cache.find(c => c.name === "📂・tickets-abertos");

    if (!openLogs) {
      await guild.channels.create({
        name: "📂・tickets-abertos",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          ...(staffRole ? [{
            id: staffRole.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages
            ]
          }] : [])
        ]
      });
    }

    // ================= FECHADOS =================
    let closeLogs = guild.channels.cache.find(c => c.name === "🔒・tickets-fechados");

    if (!closeLogs) {
      await guild.channels.create({
        name: "🔒・tickets-fechados",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: guild.members.me.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ManageChannels
            ]
          },
          ...(staffRole ? [{
            id: staffRole.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages
            ]
          }] : [])
        ]
      });
    }

    // ================= CATEGORIA =================
    let category = guild.channels.cache.find(
      c => c.name === "🎫 TICKETS" && c.type === ChannelType.GuildCategory
    );

    if (!category) {
      await guild.channels.create({
        name: "🎫 TICKETS",
        type: ChannelType.GuildCategory
      });
    }

  } catch (err) {
    console.log("Erro setup tickets:", err);
  }
}

// ================= CRIAR TICKET =================
async function createTicket(interaction, type, client) {
  const guild = interaction.guild;
  const user = interaction.user;

  const staffRoleId = await db.get(`staffRole_${guild.id}`);
  const staffRole = staffRoleId ? guild.roles.cache.get(staffRoleId) : null;

  const alreadyOpen = [...ticketOwners.values()].includes(user.id);

  if (alreadyOpen) {
    return interaction.reply({
      content: "❌ Você já tem um ticket aberto.",
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const category = guild.channels.cache.find(
    c => c.name === "🎫 TICKETS" && c.type === ChannelType.GuildCategory
  );

  if (!category) {
    return interaction.editReply("❌ Categoria não encontrada.");
  }

  const channel = await guild.channels.create({
    name: `🎫-${type}-${user.username.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`,
    type: ChannelType.GuildText,
    parent: category.id,

    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      },
      ...(staffRole ? [{
        id: staffRole.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages
        ]
      }] : []),
      ...extraRoles.map(r => ({
        id: r,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      }))
    ]
  });

  ticketOwners.set(channel.id, user.id);
  ticketData.set(channel.id, {
    createdAt: new Date(),
    messages: 0,
    users: new Set([user.id])
  });

  const embed = new EmbedBuilder()
    .setTitle(`🎫 Ticket ${type}`)
    .setDescription(`Olá ${user}, aguarde atendimento...`)
    .setColor("#3aa3e7");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("call_staff")
      .setLabel("🔔 Chamar Staff")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("notify_client")
      .setLabel("📨 Notificar Cliente")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("🔒 Fechar")
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    content: `<@${user.id}>`,
    embeds: [embed],
    components: [row]
  });

  await interaction.editReply(`✅ Ticket criado: ${channel}`);
}

// ================= INTERACTIONS =================
async function handleTicketInteractions(interaction, client) {
  if (!interaction.isButton()) return;

  const guild = interaction.guild;
  const user = interaction.user;

  const staffRoleId = await db.get(`staffRole_${guild.id}`);
  const staffRole = staffRoleId ? guild.roles.cache.get(staffRoleId) : null;

  // ================= CRIAR =================
  if (interaction.customId.startsWith("ticket_")) {
    const type = interaction.customId.replace("ticket_", "");
    return createTicket(interaction, type, client);
  }

  // ================= CHAMAR STAFF =================
  if (interaction.customId === "call_staff") {
    await interaction.channel.send(
      `🔔 ${staffRole ? `<@&${staffRole.id}>` : ""} ${user} chamou a staff!`
    );

    return interaction.reply({ content: "Staff chamada!", ephemeral: true });
  }

  // ================= NOTIFICAR CLIENTE =================
  if (interaction.customId === "notify_client") {
    const ownerId = ticketOwners.get(interaction.channel.id);
    if (!ownerId) return interaction.reply({ content: "Erro.", ephemeral: true });

    const userTarget = await client.users.fetch(ownerId);

    await userTarget.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Atualização no ticket")
          .setDescription("Sua solicitação recebeu resposta.")
          .setColor("#3aa3e7")
      ]
    });

    return interaction.reply({ content: "Cliente notificado.", ephemeral: true });
  }

  // ================= FECHAR =================
  if (interaction.customId === "close_ticket") {
    const channel = interaction.channel;
    const ownerId = ticketOwners.get(channel.id);

    await interaction.reply("Fechando ticket...");

    setTimeout(async () => {
      ticketOwners.delete(channel.id);
      ticketData.delete(channel.id);
      await channel.delete().catch(() => {});
    }, 3000);
  }
}

// ================= EXPORT =================
module.exports = {
  setupServer,
  handleTicketInteractions,
  ticketOwners,
  ticketData
};
