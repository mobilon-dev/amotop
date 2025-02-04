const {AmoJoScopeClient, AmoApiClient} = require('../../dist');

const {
  debug,
  scopeId,
  channelSecret,
  domain,
  accessToken,
  amojoUserId,
  channelBotId,
} = require('../_config');

const amoJoScopeClient = new AmoJoScopeClient({scopeId, channelSecret, debug});

const chatId = '3cc9477e-0fd8-4892-9825-1dcb7e7f6c44';
async function start () {

  const resp = await amoJoScopeClient.getChatHistory(chatId);
  console.log('resp', resp);
  
}

(start)();


