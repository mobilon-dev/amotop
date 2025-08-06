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

async function start () {
  // создаем чат
  const chatDto = amoJoScopeClient.getChatDto(amojoUserId);
  console.log('chatDto', chatDto);
  const chat = await amoJoScopeClient.createChat(chatDto);
  console.log('chat', chat);

  // прикрепляем чат к контакту
  const attach = await amoApiClient.attachChatToContact(chat.id, contactId);
  console.log('attach', JSON.stringify(attach));

  // текстовое сообщение от пользователя контакту
  const conversationId = chat.id;
  const message1 = amoJoScopeClient.getTextPayloadFromUser({
    conversationId, amojoUserId, message: 'from user text message', sourceExternalId});
  console.log('message', message1);
  
  // отправляем сообщение в чат
  const response1 = await amoJoScopeClient.sendMessage(message1);
  const msgid1 = response1.new_message.msgid;
  console.log('response', response1, msgid1);

  // текстовое сообщение от бота контакту
  const message2 = amoJoScopeClient.getTextPayloadFromBot({
    conversationId, channelBotId, message: 'from bot text message', sourceExternalId});
  console.log('message', message2);
  const response2 = await amoJoScopeClient.sendMessage(message2);
  const msgid2 = response2.new_message.msgid;
  console.log('response', response2, msgid2);

  // текстовое сообщение от контакта в сделку
  const message3 = amoJoScopeClient.getTextPayloadFromContact({
    conversationId, senderName: 'Сергей', message: 'from contact text message', sourceExternalId});
  console.log('message', message3);
  const response3 = await amoJoScopeClient.sendMessage(message3);
  const msgid3 = response3.new_message.msgid;
  console.log('response', response3, msgid3);
}

(start)();


/*
chatDto {
  conversation_id: '7316aaaf-2f52-4370-afea-0f9d884d3dd9',
  user: { ref_id: '318e5488-9e12-42a6-b534-34e1b075726a' }
}
[AmoJoScopeClient][Request] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001/chats {"conversation_id":"7316aaaf-2f52-4370-afea-0f9d884d3dd9","user":{"ref_id":"318e5488-9e12-42a6-b534-34e1b075726a"}}
[AmoJoScopeClient][Response] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001/chats 200:OK {"id":"742a15d7-dd9b-45af-9462-4111d17c407b","user":{"id":"b709edc6-8a72-490f-b8fb-fef3f46fa691"}}
chat {
  id: '742a15d7-dd9b-45af-9462-4111d17c407b',
  user: { id: 'b709edc6-8a72-490f-b8fb-fef3f46fa691' }
}
[AmoApiClient][Request] POST https://<<domain>>.amocrm.ru/api/v4/contacts/chats [{"contact_id":18847907,"chat_id":"742a15d7-dd9b-45af-9462-4111d17c407b"}]
[AmoApiClient][Response] POST https://<<domain>>.amocrm.ru/api/v4/contacts/chats 200:OK {"_total_items":1,"_embedded":{"chats":[{"chat_id":"742a15d7-dd9b-45af-9462-4111d17c407b","contact_id":18847907,"id":9828699,"request_id":"0"}]}}
attach {"_total_items":1,"_embedded":{"chats":[{"chat_id":"742a15d7-dd9b-45af-9462-4111d17c407b","contact_id":18847907,"id":9828699,"request_id":"0"}]}}
message {
  msec_timestamp: 1754496641852,
  timestamp: 1754496641,
  msgid: 'd180fd81-9969-4509-8e49-d73a6d945576',
  source: { external_id: '<<source channel code >>' },
  conversation_id: 'ce55149f-d7a1-469b-a7a6-29d8cfe68187',
  conversation_ref_id: '742a15d7-dd9b-45af-9462-4111d17c407b',
  sender: {
    id: '2ee0c9c3-4998-4784-af19-f54e4c69af21',
    ref_id: '318e5488-9e12-42a6-b534-34e1b075726a',
    name: 'Unknown'
  },
  receiver: { id: 'e9b525b1-a86f-4d30-9e5f-eaa6122e780a', name: 'Unknown' },
  message: { type: 'text', text: 'from user text message' }
}
[AmoJoScopeClient][Request] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001 {"event_type":"new_message","payload":{"msec_timestamp":1754496641852,"timestamp":1754496641,"msgid":"d180fd81-9969-4509-8e49-d73a6d945576","source":{"external_id":"<<source channel code >>"},"conversation_id":"ce55149f-d7a1-469b-a7a6-29d8cfe68187","conversation_ref_id":"742a15d7-dd9b-45af-9462-4111d17c407b","sender":{"id":"2ee0c9c3-4998-4784-af19-f54e4c69af21","ref_id":"318e5488-9e12-42a6-b534-34e1b075726a","name":"Unknown"},"receiver":{"id":"e9b525b1-a86f-4d30-9e5f-eaa6122e780a","name":"Unknown"},"message":{"type":"text","text":"from user text message"}}}
[AmoJoScopeClient][Response] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001 200:OK {"new_message":{"conversation_id":"742a15d7-dd9b-45af-9462-4111d17c407b","sender_id":"318e5488-9e12-42a6-b534-34e1b075726a","receiver_id":"0eefd103-5d5d-4bf6-88e7-1c5b87a3e973","msgid":"ecfb59bc-06c6-4c81-aca3-8745c38fb2d5","ref_id":"d180fd81-9969-4509-8e49-d73a6d945576"}}
response {
  new_message: {
    conversation_id: '742a15d7-dd9b-45af-9462-4111d17c407b',
    sender_id: '318e5488-9e12-42a6-b534-34e1b075726a',
    receiver_id: '0eefd103-5d5d-4bf6-88e7-1c5b87a3e973',
    msgid: 'ecfb59bc-06c6-4c81-aca3-8745c38fb2d5',
    ref_id: 'd180fd81-9969-4509-8e49-d73a6d945576'
  }
} ecfb59bc-06c6-4c81-aca3-8745c38fb2d5
message {
  msec_timestamp: 1754496641934,
  timestamp: 1754496641,
  msgid: '356d6405-1ddd-43cb-8c8e-ad6c6c951046',
  source: { external_id: '<<source channel code >>' },
  conversation_id: 'cfa86789-a8f1-4ca7-88cd-3e9d8687d33f',
  conversation_ref_id: '742a15d7-dd9b-45af-9462-4111d17c407b',
  sender: {
    id: '6aa145db-4601-43c7-a2f7-fdfb1596d89d',
    ref_id: '322ed207-7d69-4d06-b5fb-2422f380d1e4',
    name: 'Bot'
  },
  receiver: { id: 'cb83f032-0f48-418a-9832-0faf9f4c0c9f', name: 'Unknown' },
  message: { type: 'text', text: 'from bot text message' }
}
[AmoJoScopeClient][Request] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001 {"event_type":"new_message","payload":{"msec_timestamp":1754496641934,"timestamp":1754496641,"msgid":"356d6405-1ddd-43cb-8c8e-ad6c6c951046","source":{"external_id":"<<source channel code >>"},"conversation_id":"cfa86789-a8f1-4ca7-88cd-3e9d8687d33f","conversation_ref_id":"742a15d7-dd9b-45af-9462-4111d17c407b","sender":{"id":"6aa145db-4601-43c7-a2f7-fdfb1596d89d","ref_id":"322ed207-7d69-4d06-b5fb-2422f380d1e4","name":"Bot"},"receiver":{"id":"cb83f032-0f48-418a-9832-0faf9f4c0c9f","name":"Unknown"},"message":{"type":"text","text":"from bot text message"}}}
[AmoJoScopeClient][Response] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001 200:OK {"new_message":{"conversation_id":"742a15d7-dd9b-45af-9462-4111d17c407b","sender_id":"322ed207-7d69-4d06-b5fb-2422f380d1e4","receiver_id":"5bca6baf-01ec-4ddc-8398-6c18d027b50a","msgid":"ff8e16bd-1cae-4c0b-a1df-29a5a95f4db5","ref_id":"356d6405-1ddd-43cb-8c8e-ad6c6c951046"}}
response {
  new_message: {
    conversation_id: '742a15d7-dd9b-45af-9462-4111d17c407b',
    sender_id: '322ed207-7d69-4d06-b5fb-2422f380d1e4',
    receiver_id: '5bca6baf-01ec-4ddc-8398-6c18d027b50a',
    msgid: 'ff8e16bd-1cae-4c0b-a1df-29a5a95f4db5',
    ref_id: '356d6405-1ddd-43cb-8c8e-ad6c6c951046'
  }
} ff8e16bd-1cae-4c0b-a1df-29a5a95f4db5
message {
  msec_timestamp: 1754496642006,
  timestamp: 1754496642,
  msgid: 'c22579c8-1d12-40dd-8139-1b8817352bf7',
  source: { external_id: '<<source channel code >>' },
  conversation_id: '4401320f-6b66-4bcf-a774-90d09f138a49',
  conversation_ref_id: '742a15d7-dd9b-45af-9462-4111d17c407b',
  sender: { id: '5e9c838b-b38e-4581-9a95-7c10e3d2dc79', name: 'Сергей' },
  message: { type: 'text', text: 'from contact text message' }
}
[AmoJoScopeClient][Request] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001 {"event_type":"new_message","payload":{"msec_timestamp":1754496642006,"timestamp":1754496642,"msgid":"c22579c8-1d12-40dd-8139-1b8817352bf7","source":{"external_id":"<<source channel code >>"},"conversation_id":"4401320f-6b66-4bcf-a774-90d09f138a49","conversation_ref_id":"742a15d7-dd9b-45af-9462-4111d17c407b","sender":{"id":"5e9c838b-b38e-4581-9a95-7c10e3d2dc79","name":"Сергей"},"message":{"type":"text","text":"from contact text message"}}}
[AmoJoScopeClient][Response] POST https://amojo.amocrm.ru/v2/origin/custom/ce2680ce-8bb0-4349-9c66-27f8fdc0d230_46286a58-68c7-430a-822c-8006548e9001 200:OK {"new_message":{"conversation_id":"742a15d7-dd9b-45af-9462-4111d17c407b","sender_id":"4759c1fb-1704-48d6-9eb1-92aeaed62cd6","msgid":"a38c1c1a-9a17-483d-9d5d-bd0979800b8a","ref_id":"c22579c8-1d12-40dd-8139-1b8817352bf7"}}
response {
  new_message: {
    conversation_id: '742a15d7-dd9b-45af-9462-4111d17c407b',
    sender_id: '4759c1fb-1704-48d6-9eb1-92aeaed62cd6',
    msgid: 'a38c1c1a-9a17-483d-9d5d-bd0979800b8a',
    ref_id: 'c22579c8-1d12-40dd-8139-1b8817352bf7'
  }
} a38c1c1a-9a17-483d-9d5d-bd0979800b8a
