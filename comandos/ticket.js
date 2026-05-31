const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType
} = require("discord.js");

module.exports = {
  name: "ticket",

  async execute(message, args) {

    // Apenas administrador
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Você precisa ser administrador.");
    }

    // =========================
    // PAINEL
    // =========================

    const painel = new EmbedBuilder()
      .setTitle("🎫 Central de Atendimento")
      .setDescription(
        "Clique no botão abaixo para abrir um ticket."
      )
      .setColor("#2b2d31")
      .setFooter({
        text: message.guild.name
      });

    const categoriaBotoes = new ActionRowBuilder().addComponents(

  new ButtonBuilder()
    .setCustomId("ticket_compras")
    .setLabel("Compras")
    .setEmoji("🛒")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("ticket_parcerias")
    .setLabel("Parcerias")
    .setEmoji("🤝")
    .setStyle(ButtonStyle.Primary),

  new ButtonBuilder()
    .setCustomId("ticket_duvidas")
    .setLabel("Dúvidas")
    .setEmoji("❓")
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId("ticket_denuncias")
    .setLabel("Denúncias")
    .setEmoji("🚨")
    .setStyle(ButtonStyle.Danger),

  new ButtonBuilder()
    .setCustomId("ticket_outros")
    .setLabel("Outros")
    .setEmoji("📌")
    .setStyle(ButtonStyle.Secondary)

);

    await message.channel.send({
      embeds: [painel],
      components: [categoriaBotoes]
    });

    // =========================
    // INTERAÇÃO
    // =========================

    const collector = message.channel.createMessageComponentCollector();

    collector.on("collect", async (interaction) => {

      if (
  interaction.customId.startsWith("ticket_") &&
  interaction.customId !== "abrir_ticket"
) {

  let categoria = "Outros";
  let descricao = "Descreva seu atendimento.";

  switch (interaction.customId) {

    case "ticket_compras":
      categoria = "compras";
      descricao = "Informe o produto ou serviço que deseja adquirir.";
      break;

    case "ticket_parcerias":
      categoria = "parcerias";
      descricao = "Explique sua proposta de parceria.";
      break;

    case "ticket_duvidas":
      categoria = "duvidas";
      descricao = "Envie sua dúvida detalhadamente.";
      break;

    case "ticket_denuncias":
      categoria = "denuncias";
      descricao = "Informe a denúncia com provas se possível.";
      break;

    case "ticket_outros":
      categoria = "outros";
      descricao = "Explique o motivo do seu ticket.";
      break;
  }

  const canal = await interaction.guild.channels.create({
    name: `${categoria}-${interaction.user.username}`,
    type: ChannelType.GuildText,

    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      }
    ]
  });

  const embedTicket = new EmbedBuilder()
    .setTitle(`🎫 Ticket de ${categoria}`)
    .setDescription(
      `${interaction.user}\n\n${descricao}`
    )
    .setColor("Green");

  await canal.send({
    content: `${interaction.user}`,
    embeds: [embedTicket],
    components: [fecharBotao]
  });

  return interaction.update({
    content: `✅ Ticket criado: ${canal}`,
    embeds: [],
    components: []
  });
      }

      // =========================
      // ABRIR TICKET
      // =========================

      if (interaction.customId === "abrir_ticket") {

        const ticketExistente = interaction.guild.channels.cache.find(
          c => c.name === `ticket-${interaction.user.id}`
        );

        if (ticketExistente) {
          return interaction.reply({
            content: `❌ Você já possui um ticket: ${ticketExistente}`,
            ephemeral: true
          });
        }

        const canal = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,

          type: ChannelType.GuildText,

          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                PermissionsBitField.Flags.ViewChannel
              ]
            },

            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]
        });

        const embedTicket = new EmbedBuilder()
          .setTitle("🎫 Ticket Aberto")
          .setDescription(
            `Olá ${interaction.user}, descreva seu problema.\n\nA equipe responderá em breve.`
          )
          .setColor("Green");

        const fecharBotao = new ActionRowBuilder().addComponents(

  new ButtonBuilder()
    .setCustomId("fechar_ticket")
    .setLabel("Fechar Ticket")
    .setEmoji("🔒")
    .setStyle(ButtonStyle.Danger),

  new ButtonBuilder()
    .setCustomId("notificar_cliente")
    .setLabel("Notificar Cliente")
    .setEmoji("📩")
    .setStyle(ButtonStyle.Secondary)

);

        await canal.send({
          content: `${interaction.user}`,
          embeds: [embedTicket],
          components: [fecharBotao]
        });

        await interaction.reply({
          content: `✅ Seu ticket foi criado: ${canal}`,
          ephemeral: true
        });
      }

      // =========================
      // FECHAR TICKET
      // =========================
      if (interaction.customId === "notificar_cliente") {

  const id = interaction.channel.name.replace("ticket-", "");

  const usuario = await interaction.guild.members
    .fetch(id)
    .catch(() => null);

  if (!usuario) {
    return interaction.reply({
      content: "❌ Usuário não encontrado.",
      ephemeral: true
    });
  }

  const embed = new EmbedBuilder()
    .setTitle("📩 Ticket Atualizado")
    .setDescription(
      `Olá ${usuario.user}, a equipe respondeu seu ticket.\n\nVolte ao servidor para verificar.`
    )
    .setColor("#5865F2")
    .setThumbnail(interaction.guild.iconURL())
    .setTimestamp();

  try {

    await usuario.send({
      embeds: [embed]
    });

    interaction.reply({
      content: "✅ Cliente notificado no privado.",
      ephemeral: true
    });

  } catch {

    interaction.reply({
      content: "❌ Não consegui enviar mensagem no privado.",
      ephemeral: true
    });

  }

      }

      if (interaction.customId === "fechar_ticket") {

        await interaction.reply({
          content: "🔒 Fechando ticket em 5 segundos..."
        });

        setTimeout(() => {
          interaction.channel.delete().catch(() => {});
        }, 5000);
      }

    });

  }
};
