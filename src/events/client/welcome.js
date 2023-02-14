module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    const channelId = "1073637369976209498"; // welcome channel
    const targetChannelId = "1073651165067218944"; // rule and info
    console.log(member, "success");

    const message = `Please welcome <@${
      member.id
    }> to the server! Please check out ${member.guild.channels.cache
      .get(targetChannelId)
      .toString()} `;
    const channel = member.guild.channels.cache.get(channelId);
    channel.send(message);
  },
};
