const { hours, timezones } = require("../../utils/scheduleOptionsData");
const momentTimezone = require("moment-timezone");
const {
  SlashCommandBuilder,
  MessageCollector,
  PermissionFlagsBits,
} = require("discord.js");

const scheduleSchema = require("../../schemas/schedule-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName("schedule")
    .setDescription("Schedule a message")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setRequired(true)
        .setDescription("choose a channel")
    )
    .addStringOption((option) =>
      option.setName("yyyy").setRequired(true).setDescription("Year")
    )
    .addStringOption((option) =>
      option.setName("mm").setRequired(true).setDescription("Month")
    )
    .addStringOption((option) =>
      option.setName("dd").setRequired(true).setDescription("Day")
    )
    .addStringOption((option) =>
      option.setName("hour").setRequired(true).setDescription("Hour")
    )
    .addStringOption((option) =>
      option.setName("minutes").setRequired(true).setDescription("Minutes")
    )
    .addStringOption((option) =>
      option
        .setName("meridiem")
        .setRequired(true)
        .setDescription("choose AM or PM")
        .addChoices({ name: "AM", value: "AM" }, { name: "PM", value: "PM" })
    )
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setRequired(true)
        .setDescription("Selected a timezone")
        .addChoices(...timezones)
    ),
  async execute(interaction, client) {
    const [channel, year, month, day, hour, minute, meridiem, timezone] =
      interaction.options._hoistedOptions;

    const targetDate = momentTimezone.tz(
      `${year.value}/${month.value}/${day.value} ${hour.value}:${minute.value} ${meridiem.value}`,
      "YYYY-MM-DD HH:mm A",
      timezone.value
    );

    await interaction.reply({
      content: "Please send the message you would like to schedule",
      ephemeral: true,
    });

    const filter = (newMessage) => {
      return newMessage.author.id === interaction.user.id;
    };

    const collector = interaction.channel.createMessageCollector({
      filter,
      max: 1,
      time: 1000 * 60,
    });

    collector.on("end", async (collected) => {
      const collectedMessage = collected.first();

      if (!collectedMessage) {
        await interaction.editReply({
          content: "You did not reply in time.",
          ephemeral: true,
        });
      } else {
        await interaction.editReply({
          content: "Your message has been scheduled",
          ephemeral: true,
        });
        await new scheduleSchema({
          date: targetDate.valueOf(),
          content: collectedMessage.content,
          guildId: interaction.guildId,
          channelId: channel.value,
          userId: interaction.user.id,
        }).save();
        collectedMessage.delete();
      }
      setTimeout(() => interaction.deleteReply(), 10000);
    });
  },
};
