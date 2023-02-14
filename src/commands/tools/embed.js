const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Return an embed!"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`This is an Embed`)
      .setDescription("This is a description")
      .setColor(0x12e1ee)
      .setImage(client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setAuthor({
        url: `https://www.youtube.com`,
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      })
      .setURL(`https://www.espn.com`)
      .addFields([
        {
          name: "Field 1",
          value: "Field value 1",
          inline: true,
        },
        {
          name: "Field 2",
          value: "Field value 2",
          inline: true,
        },
      ]);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
