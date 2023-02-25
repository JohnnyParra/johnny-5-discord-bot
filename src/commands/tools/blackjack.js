const { deck: Deck, shuffle, cardsToString, checkCardTotal } = require("../../utils/deck");
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageCollector, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("play blackjack"),
  async execute(interaction) {
    await interaction.reply({content: 'Lets play blackJack'});

    // Initializing game
    let deck = shuffle(Deck);
    let money = 100;
    let dealerCards = [];
    let playerCards = [];

    // Deal initial cards
    playerCards.push(deck.pop());
    dealerCards.push(deck.pop());
    playerCards.push(deck.pop());
    dealerCards.push(deck.pop());

    // Embed showing current condition
    let embed = embedMaker("player");

    // buttons
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
    
    await interaction.editReply({
      embeds: [embed]
    });

    // Main function
    async function game() {
      await interaction.editReply({ components: [row] });
      const filter = (btnInteraction) => {
        return btnInteraction.user.id === interaction.user.id;
      };
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 1000 * 60,
      });
      collector.on('end', async (collected) => {
        const click = collected.first();
        click.deferUpdate();
        if(click.customId === 'hit'){
          playerCards.push(deck.pop())
          const newEmbed = embedMaker("player")
          await interaction.editReply({content: "Hit!", embeds: [newEmbed]})
          if(checkCardTotal(playerCards) < 21){game()}
        } else if(click.customId === 'stand'){
          await interaction.editReply({content: "Stand!", components: []})
          const newEmbed = embedMaker("dealer")
          await interaction.editReply({embeds: [newEmbed]});
          await pause(2000);
          while(checkCardTotal(dealerCards) < 17){
            dealerCards.push(deck.pop());
            const newEmbed = embedMaker("dealer")
            await interaction.editReply({embeds: [newEmbed]})
            await pause(2000);
          }
        }
      });
    }

    function pause(time){
      return new Promise((resolve, reject) => setTimeout(resolve, time));
    }

    function embedMaker(state) {
      let dealerValue;
      if(state === "player"){
        dealerValue = `Up Card: ${dealerCards[0].card} Total: ?`;
      } else if (state === "dealer"){
        dealerValue = `Cards: ${cardsToString(dealerCards)} Total: ${checkCardTotal(dealerCards)}`;
      }
      return (new EmbedBuilder()
        .setTitle('Blackjack')
        .setDescription(`Money: ${money}`)
        .addFields([
          {
            name: `Dealer`,
            value: dealerValue,
            inline: true,
          },
          {
            name: `Player`,
            value: `Cards: ${cardsToString(playerCards)} Total: ${checkCardTotal(playerCards)}`,
            inline: false,
          },
        ]));
    };

    game();

    // async function gameStateEmbed(money, dealer, player, state, row){
    //   let dealerCards;
    //   if(state === 1){
    //     dealerCards = `${dealer[0].card}, H`;
    //   } else if(state === 0) {
    //     await dealerDraw();
    //     dealerCards = dealer.map(card => {return `${card.card}`}).join(", ");
    //   } 

    //   if(await checkCardTotal(Dealer) > 21){
    //     await endRound(state);
    //   } else if (state === 0 && checkCardTotal(Player) <= checkCardTotal(Player)){
    //     await endRound(state);
    //   }

    //   const playerCards = player.map(card => {return `${card.card}`}).join(", ");
    //   const embed = new EmbedBuilder()
    //     .setTitle('Blackjack')
    //     .setDescription(`Money: ${money}`)
    //     .addFields([
    //       {
    //         name: `Dealer`,
    //         value: `Cards: ${dealerCards}`,
    //         inline: true,
    //       },
    //       {
    //         name: `Player`,
    //         value: `Cards: ${playerCards} Total: ${await checkCardTotal(Player)}`,
    //         inline: false,
    //       },
    //     ])
    //   interactionCollector(embed, row)
    // }

    // async function dealerDraw(){
    //   if(await checkCardTotal(Dealer) < 17){
    //     Dealer.push(await nextCard(Deck, Used))
    //     Used.push(Dealer[Dealer.length - 1])
    //     dealerDraw();
    //   }
    // }


    // async function interactionCollector(embed, row){
    //   await interaction.editReply({
    //     embeds: [embed],
    //     components: [row]
    //   });


    //   const collector = interaction.channel.createMessageComponentCollector({
    //     max: 1,
    //     time: 10000 * 60,
    //   });
  

    //   collector.on('end', (collection) => {
    //     collection.forEach(async (click) => {
    //       click.deferUpdate();
    //       if(click.customId === 'hit'){
    //         await interaction.editReply({content: "Hit!"})
    //         Player.push(nextCard(Deck,Used))
    //         Used.push(Player[Player.length - 1])
    //         await endRound();
    //         // gameStateEmbed(Money, Dealer, Player, 1, row)
    //       } else if(click.customId === 'stand'){
    //         await interaction.editReply({content: "Stand!"})
    //         gameStateEmbed(Money, Dealer, Player, 0, row)
    //       }
    //       console.log(click.customId);
    //     })
    //   })
    // }

    // async function endRound(state) {
    //   const playerTotal = await checkCardTotal(Player);
    //   const dealerTotal = await checkCardTotal(Dealer);
    //   if(playerTotal > 21){
    //     await interaction.editReply({content: "You lost"})
    //     Money -= 5;
    //     Player = [await nextCard(Deck, Used)];
    //     Used.push(Player[Player.length - 1])
    //     Dealer = [await nextCard(Deck, Used)];
    //     Used.push(Dealer[Dealer.length - 1])
    //     Player.push(await nextCard(Deck, Used));
    //     Used.push(Player[Player.length - 1])
    //     Dealer.push(await nextCard(Deck, Used));
    //     Used.push(Dealer[Dealer.length - 1])
    //     gameStateEmbed(Money, Dealer, Player, 1, row)
    //   } else if(dealerTotal > 21 || (state === 0 && playerTotal < dealerTotal)) {
    //     await interaction.editReply({content: "You Won"})
    //     Money += 5;
    //     Player = [await nextCard(Deck, Used)];
    //     Used.push(Player[Player.length - 1])
    //     Dealer = [await nextCard(Deck, Used)];
    //     Used.push(Dealer[Dealer.length - 1])
    //     Player.push(await nextCard(Deck, Used));
    //     Used.push(Player[Player.length - 1])
    //     Dealer.push(await nextCard(Deck, Used));
    //     Used.push(Dealer[Dealer.length - 1])
    //     gameStateEmbed(Money, Dealer, Player, 1, row)
    //   } else if(state === 0 && playerTotal === dealerTotal){
    //     await interaction.editReply({content: "Push"})
    //     Player = [await nextCard(Deck, Used)];
    //     Used.push(Player[Player.length - 1])
    //     Dealer = [await nextCard(Deck, Used)];
    //     Used.push(Dealer[Dealer.length - 1])
    //     Player.push(await nextCard(Deck, Used));
    //     Used.push(Player[Player.length - 1])
    //     Dealer.push(await nextCard(Deck, Used));
    //     Used.push(Dealer[Dealer.length - 1])
    //     gameStateEmbed(Money, Dealer, Player, 1, row)
    //   }else {
    //     gameStateEmbed(Money, Dealer, Player, 1, row)
    //   }
    // }
    // gameStateEmbed(Money, Dealer, Player, 1, row)
  },
};