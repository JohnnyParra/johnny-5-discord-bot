const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("play blackjack"),
  async execute(interaction) {

    await interaction.reply({
      content: "play a game of blackjack",
    });
  },
};