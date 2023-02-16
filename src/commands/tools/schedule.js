const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName("schedule")
    .setDescription("Schedule a message")
    .addChannelOption(option =>
      option.setName("channel")
      .setRequired(true)
      .setDescription("choose a channel")
    )
    // .addStringOption(option =>
    //   option.setName("yyyy/mm/dd")
    //   .setRequired(true)
    //   .setDescription("Date")
    // )
    // .addStringOption(option => 
    //   option.setName("hh:mm")
    //   .setRequired(true)
    //   .setDescription("Time")
    // )
    .addStringOption(option => 
      option.setName("meridiem")
      .setRequired(true)
      .setDescription("choose AM or PM")
      .addChoices(
        { name: 'AM', value: 'AM' },
        { name: 'PM', value: 'PM' },
    )),
  async execute(interaction, client) {

    // console.log(client.channels.cache);

    await interaction.reply({
      content: "This command is under construction",
    });
  },
};