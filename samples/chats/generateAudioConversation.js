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
const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const contactId = 4312867;
const sourceExternalId = 'channelu64pwcou';
const mediaUrl = 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3';

async function start () {
  // создаем чат
  const chatDto = amoJoScopeClient.getChatDto(amojoUserId);
  console.log('chatDto', chatDto);
  const chat = await amoJoScopeClient.createChat(chatDto);
  console.log('chat', chat);

  // прикрепляем чат к контакту
  const attach = await amoApiClient.attachChatToContact(chat.id, contactId);
  console.log('attach', JSON.stringify(attach));

  // картинка от пользователя контакту
  const conversationId = chat.id;
  const message1 = amoJoScopeClient.getAudioPayloadFromUser({
    conversationId, amojoUserId, message: 'from user audio message', mediaUrl, sourceExternalId});
  console.log('message', message1);
  
  // отправляем сообщение в чат
  const response1 = await amoJoScopeClient.sendMessage(message1);
  const msgid1 = response1.new_message.msgid;
  console.log('response', response1, msgid1);

  // картинка от бота контакту
  const message2 = amoJoScopeClient.getAudioPayloadFromBot({
    conversationId, channelBotId, message: 'from bot audio message', mediaUrl, sourceExternalId});
  console.log('message', message2);
  const response2 = await amoJoScopeClient.sendMessage(message2);
  const msgid2 = response2.new_message.msgid;
  console.log('response', response2, msgid2);

  // картинка от контакта в сделку
  const message3 = amoJoScopeClient.getAudioPayloadFromContact({
    conversationId, senderName: 'Сергей', message: 'from contact audio message', mediaUrl, sourceExternalId});
  console.log('message', message3);
  const response3 = await amoJoScopeClient.sendMessage(message3);
  const msgid3 = response3.new_message.msgid;
  console.log('response', response3, msgid3);
}

(start)();


