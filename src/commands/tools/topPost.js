const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top-post")
    .setDescription("Returns top post on this channel"),
  async execute(interaction, client) {
    let reactionsArray = []

    const messages = await client.channels.cache
      .get(interaction.channel.id)
      .messages.fetch({ limit: 100 });

    const reactions = await messages.forEach(message => {
      message.reactions.cache.forEach(reaction => {
        reactionsArray.push({count: reaction.count, id: reaction.message.id})
      })
    });
    console.log(reactionsArray);
    // const embed = new EmbedBuilder()
    //   .setTitle("Top Posts")

    // await interaction.reply({
    //   embeds: [embed],
    // });
  },
};