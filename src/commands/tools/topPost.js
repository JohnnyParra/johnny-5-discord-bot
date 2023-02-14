const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top-post")
    .setDescription("Returns top post on this channel"),
  async execute(interaction, client) {
    const messages = await client.channels.cache
      .get(interaction.channel.id)
      .messages.fetch({ limit: 100 });
    // console.log(messages);
    // console.log("\n////////////////////////");
    const reactions = messages.forEach(message => {
      console.log(message.reactions.cache)
    })
    // const embed = new EmbedBuilder()

    // await interaction.reply({
    //   embeds: [embed],
    // });
  },
};
1075115487190597672