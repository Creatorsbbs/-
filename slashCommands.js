const fs = require("fs");
const path = require("path");
const {
  REST,
  Routes
} = require("discord.js");

module.exports = async (client) => {

  client.slashCommands = new Map();

  const commands = [];

  const slashPath = path.join(__dirname, "slash");

  const files = fs
    .readdirSync(slashPath)
    .filter(file => file.endsWith(".js"));

  for (const file of files) {

    const command = require(`./slash/${file}`);

    client.slashCommands.set(
      command.data.name,
      command
    );

    commands.push(
      command.data.toJSON()
    );
  }

  const rest = new REST({
    version: "10"
  }).setToken(process.env.TOKEN);

  try {

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID
      ),
      {
        body: commands
      }
    );

    console.log("Slash commands registrados.");

  } catch (err) {
    console.error(err);
  }

  client.on(
    "interactionCreate",
    async interaction => {

      if (
        !interaction.isChatInputCommand()
      ) return;

      const command =
        client.slashCommands.get(
          interaction.commandName
        );

      if (!command) return;

      try {

        await command.execute(
          interaction
        );

      } catch (err) {

        console.error(err);

        if (
          !interaction.replied
        ) {
          interaction.reply({
            content:
              "Erro ao executar comando.",
            ephemeral: true
          });
        }

      }

    }
  );

};
