const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top-post")
    .setDescription("Returns top post on this channel"),
  async execute(interaction, client) {

    async function getMessages(){
      const messages = await client.channels.cache
        .get(interaction.channel.id)
        .messages.fetch({ limit: 100 })
      return messages
    }

    async function getReaction(){
      let reactionsArray = []
      const messages = await getMessages();
      await messages.forEach(message => {
        // console.log(message.reactions.cache)
        message.reactions.cache.forEach(reaction => {
          const index = reactionsArray.findIndex(e => e.id === reaction.message.id)
          if (index > -1){
            reactionsArray[index].count += reaction.count;
          } else{
            reactionsArray.push({count: reaction.count, id: reaction.message.id, message : reaction.message})
          }
        })
      })
      return reactionsArray.sort((x,y) => y.count - x.count).splice(0,3);
    }

    const reactionsArray = await getReaction();

    const embed = new EmbedBuilder()
    .setTitle(`Top Posts`)
    .setDescription("Top 3 posts from this channel")
    .setColor(0x12e1ee)
    .setTimestamp(Date.now())
    .addFields([
      {
        name: "#1 Post",
        value: `Reactions: ${reactionsArray[0].count} ${reactionsArray[0].message.url}`,
        inline: true,
      },
      {
        name: "#2 Post",
        value: `Reactions: ${reactionsArray[1].count} ${reactionsArray[1].message.url}`,
        inline: false,
      },
      {
        name: "#3 Post",
        value: `Reactions: ${reactionsArray[2].count} ${reactionsArray[2].message.url}`,
        inline: true,
      },
    ]);

    await interaction.reply({
      embeds: [embed],
    });
  },
};