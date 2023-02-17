const { hours, timezones } = require("../../utils/scheduleOptionsData");
const momentTimezone = require("moment-timezone");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const scheduleSchema = require("../../schemas/schedule-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName("check-schedule")
    .setDescription("check scheduled messages"),
  async execute(interaction, client) {
    const query = {
      userId: {
        $eq: interaction.user.id,
      },
    };
    const results = await scheduleSchema.find(query);

    let resultsElements = "Your scheduled dates: ";
    results.map((result) => {
      resultsElements += `${result.date}/ `;
    });

    await interaction.reply({
      content: resultsElements,
      ephemeral: true,
    });
  },
};
