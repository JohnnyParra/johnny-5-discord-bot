const { deck, shuffle, nextCard, checkCardTotal } = require("../../utils/deck");
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageCollector, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("play blackjack"),
  async execute(interaction) {
    await interaction.reply({content: 'Lets play'})
    let Deck = shuffle(deck);
    let Money = 100;
    let Dealer = [Deck[1], Deck[3]];
    let Player = [Deck[0], Deck[2]];
    let Used = [...Dealer, ...Player]
    

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
      );


    async function gameStateEmbed(money, dealer, player, state, row){
      let dealerCards;
      if(state === 1){
        dealerCards = `${dealer[0].card}, H`;
      } else if(state === 0) {
        dealerCards = dealer.map(card => {return `${card.card}`}).join(", ");
      } 
      const playerCards = player.map(card => {return `${card.card}`}).join(", ");
      const embed = new EmbedBuilder()
        .setTitle('Blackjack')
        .setDescription(`Money: ${money}`)
        .addFields([
          {
            name: `Dealer`,
            value: `Cards: ${dealerCards}`,
            inline: true,
          },
          {
            name: `Player`,
            value: `Cards: ${playerCards} Total: ${await checkCardTotal(Player)}`,
            inline: false,
          },
        ])
      interactionCollector(embed, row)
    }


    async function interactionCollector(embed, row){
      await interaction.editReply({
        embeds: [embed],
        components: [row]
      });


      const collector = interaction.channel.createMessageComponentCollector({
        max: 1,
        time: 10000 * 60,
      });
  

      collector.on('end', (collection) => {
        collection.forEach(async (click) => {
          click.deferUpdate();
          if(click.customId === 'hit'){
            await interaction.editReply({content: "Hit!"})
            Player.push(nextCard(Deck,Used))
            Used.push(Player[Player.length - 1])
            await endRound("player");
            // gameStateEmbed(Money, Dealer, Player, 1, row)
          } else if(click.customId === 'stand'){
            await interaction.editReply({content: "Stand!"})
            gameStateEmbed(Money, Dealer, Player, 0, row)
          }
          console.log(click.customId);
        })
      })
    }

    async function endRound(person) {
      if (person === "player"){
        if(await checkCardTotal(Player) > 21){
          await interaction.editReply({content: "You lost"})
          Money -= 5;
          Player = [await nextCard(Deck, Used)];
          Used.push(Player[Player.length - 1])
          Dealer = [await nextCard(Deck, Used)];
          Used.push(Dealer[Dealer.length - 1])
          Player.push(await nextCard(Deck, Used));
          Used.push(Player[Player.length - 1])
          Dealer.push(await nextCard(Deck, Used));
          Used.push(Dealer[Dealer.length - 1])
          gameStateEmbed(Money, Dealer, Player, 1, row)
        } else {
          gameStateEmbed(Money, Dealer, Player, 1, row)
        }
      }
    }
    gameStateEmbed(Money, Dealer, Player, 1, row)
  },
};