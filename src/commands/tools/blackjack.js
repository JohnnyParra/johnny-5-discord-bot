const { deck: Deck, shuffle, cardsToString, checkCardTotal } = require("../../utils/deck");
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageCollector, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("play blackjack"),
  async execute(interaction) {
    let collector;
    let message = await interaction.reply({content: 'Lets play blackJack'});

    // Initializing game
    let deck = shuffle([...Deck]);
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
      if (await isNatural21()) {
        await checkForNatural21();
      } else {
        await interaction.editReply({ components: [row] });
        const filter = (btnInteraction) => {
          return btnInteraction.message.interaction.id === message.id && btnInteraction.user.id === interaction.user.id;
        };
        collector = interaction.channel.createMessageComponentCollector({
          filter,
          max: 1,
          time: 1000 * 60,
        });
        collector.on('end', async (collected) => {
          const click = collected.first();
          if(!click) {
            await interaction.editReply({content: "Time Ended. Final Score: " + money, embeds: [], components: []});
          }
          click?.deferUpdate();
          if(click?.customId === 'hit'){
            playerCards.push(deck.pop())
            const newEmbed = embedMaker("player")
            await interaction.editReply({content: "Hit!", embeds: [newEmbed]})
            if(checkCardTotal(playerCards) < 21){
              game()
            }else if(checkCardTotal(playerCards) > 21){
              await interaction.editReply({ content: "Bust!", embeds: [embedMaker("dealer")], components: []})
              await pause(1000)
              money -= 5;
              await interaction.editReply({ embeds: [embedMaker("dealer")] })
              await pause(3000);
              newRound();
            }else if(checkCardTotal(playerCards) == 21){
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
              checkWinner();
            }
          }else if(click?.customId === 'stand'){
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
            checkWinner();
          }
        });
      }
    }

    function pause(time){
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function checkWinner(){
      if(checkCardTotal(dealerCards) > 21){
        await interaction.editReply({content: "Winner!", components: []})
        await pause(1000);
        money += 5;
        await interaction.editReply({ embeds: [embedMaker("dealer")] })
        await pause(3000);
        newRound();
      }else if(checkCardTotal(playerCards) > checkCardTotal(dealerCards)){
        await interaction.editReply({content: "Winner!", components: []})
        await pause(1000);
        money += 5;
        await interaction.editReply({ embeds: [embedMaker("dealer")] })
        await pause(3000);
        newRound();
      }else if(checkCardTotal(playerCards) < checkCardTotal(dealerCards)){
        await interaction.editReply({content: "Loser!", components: []})
        await pause(1000);
        money -= 5;
        await interaction.editReply({ embeds: [embedMaker("dealer")] })
        await pause(3000);
        newRound();
      }else {
        await interaction.editReply({content: "Push!", components: []})
        await pause(3000);
        newRound();
      }
    }

    async function newRound(){
      dealerCards = [];
      playerCards = [];

      if (deck.length < 78) {
        deck = shuffle([...Deck]);
      }

      playerCards.push(deck.pop());
      dealerCards.push(deck.pop());
      playerCards.push(deck.pop());
      dealerCards.push(deck.pop());
      const embed = embedMaker("player")
      await interaction.editReply({content: "new hand", embeds: [embed]})
      game();
    }

    function embedMaker(state) {
      let dealerValue;
      if(state === "player"){
        dealerValue = `Cards: ${dealerCards[0].card}, ? Total: ?`;
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

    async function isNatural21() {
      const playerNatural21 = playerCards.find(card => card.card == "A") && playerCards.find(card => card.value == 10 );
      const dealerNatural21 = dealerCards.find(card => card.card == "A") && dealerCards.find(card => card.value == 10 );
      return playerNatural21 || dealerNatural21;
    }

    async function checkForNatural21() {
      const playerNatural21 = playerCards.find(card => card.card == "A") && playerCards.find(card => card.value == 10 );
      const dealerNatural21 = dealerCards.find(card => card.card == "A") && dealerCards.find(card => card.value == 10 );
      if(playerNatural21 && dealerNatural21){
        await interaction.editReply({content: "Push!"})
        await pause(3000);
        newRound();
      }else if(playerNatural21){
        await interaction.editReply({content: "21!"})
        await pause(1000);
        money += 8;
        await interaction.editReply({ embeds: [embedMaker("dealer")] })
        await pause(3000);
        newRound();
      }else if(dealerNatural21){
        await interaction.editReply({content: "Dealer 21!"})
        await pause(1000);
        money -= 5;
        await interaction.editReply({ embeds: [embedMaker("dealer")] })
        await pause(3000);
        newRound();
      }
    }

    game();
  },
};