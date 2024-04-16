require("dotenv").config();

const { token, DatabaseURL } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { VoiceClient } = require("djs-voice");
const mongoose = require("mongoose");
const fs = require("fs");

mongoose.set("strictQuery", true);
mongoose
  .connect(DatabaseURL, {
    keepAlive: true,
  })
  .then(console.log("db connected"));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const voiceClient = new VoiceClient({
  allowBots: false,
  client: client,
  debug: false,
  mongooseConnectionString: DatabaseURL,
});

client.voiceClient = voiceClient;
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

process.on("unhandledRejection", async (reason, promise) => {
  console.log("unhandledRejection at: ", promise, "reason: ", reason);
})

process.on("uncaughtException", async (reason, promise) => {
  console.log("uncaughtException at: ", promise, "reason: ", reason);
})

process.on("uncaughtExceptionMonitor", async (reason, promise) => {
  console.log("uncaughtExceptionMonitor at: ", promise, "reason: ", reason);
})

client.handleEvents();
client.handleCommands();
client.login(token);
