const { Deck, shuffle } = require("../../utils/deck");
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageCollector } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("play blackjack"),
  async execute(interaction) {
    let deck = shuffle(Deck);
    let dealer = [deck[1], deck[3]];
    let player = [deck[0], deck[2]];
    console.log(dealer, player);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('hit')
          .setLabel('Hit')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('stand')
          .setLabel('Stand')
          .setStyle(ButtonStyle.Danger),
      )

    await interaction.reply({
      content: "play a game of blackjack",
      components: [row]
    });

    const collector = interaction.channel.createMessageComponentCollector({
      max: 1,
      time: 1000 * 15,
    });

    collector.on('collect', () => {
      interaction.editReply({
        content: 'you clicked the button'
      })
    });

    collector.on('end', (collection) => {
      collection.forEach((click) => {
        console.log(click.customId);
      })
    })
  },
};