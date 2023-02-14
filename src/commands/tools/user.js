const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user"),
  async execute(interaction) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    
    const newMessage = `This command was run by ${interaction.user.username},\nWho joined on ${interaction.member.joinedAt}. `;
    await interaction.editReply({
      content: newMessage,
    });
  },
};
