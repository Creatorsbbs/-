module.exports = async (interaction) => {

  if (!interaction.isButton()) return;

  if (
    ![
      "ticket_compras",
      "ticket_parcerias",
      "ticket_duvidas",
      "ticket_denuncias",
      "ticket_outros"
    ].includes(interaction.customId)
  ) return;

  // resto do código que está dentro do collector
};
