const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "Este comando esta desactualizado.",
        ephermal: true,
      });

    if (command.developer && interaction.user.id !== "719285265675452437")
      return interaction.reply({
        content: "Este comando solo está disponible para el desarrollador..",
        ephermal: true,
      });

    command.execute(interaction, client);
  },
};