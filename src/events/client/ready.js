const scheduleSchema = require("../../schemas/schedule-schema");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready!! ${client.user.tag} is logged in and online`);

    const checkForPosts = async () => {
      const query = {
        date: {
          $lte: Date.now(),
        },
      };
      const results = await scheduleSchema.find(query);

      for (const post of results) {
        const { guildId, channelId, content } = post;
        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
          continue;
        }

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
          continue;
        }
        channel.send(content);
      }

      await scheduleSchema.deleteMany(query);

      setTimeout(checkForPosts, 1000 * 10);
    };
    checkForPosts();
  },
};
