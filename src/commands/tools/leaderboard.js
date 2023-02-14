const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Returns voice leaderboard"),
  async execute(interaction, client) {
    const embed = await client.voiceClient.generateLeaderboard({
      guild: await interaction.guild,
       top: 10, 
    });
    await interaction.reply({
      embeds: [embed],
    });
  },
};
