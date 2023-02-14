module.exports = {
  name: "voiceStateUpdate",
  once: false,
  async execute(oldState, newState, client) {
    client.voiceClient.startListener(oldState, newState)
  }
};
