# @mobilon-org/amotop

@mobilon-org/amotop - еще один amoCRM API клиент для node.js

[Репозиторий](https://github.com/mobilon-org/amotop)

[Документация](https://mobilon-org.github.io/amotop/)

## Зачем?

Простой клиент-обертка на API amoCRM, чтобы помочь коллеге быстро разобраться с концепцией amoCRM и начать приносить пользу.

## Установка

`````
npm i @mobilon-org/amotop

`````

## Использование

`````javascript

const {AmoJoScopeClient, AmoApiClient} = require('@mobilon-org/amotop');

const {debug, scopeId, channelSecret, domain, accessToken} = require('../_config');

const amoJoScopeClient = new AmoJoScopeClient({scopeId, channelSecret, debug});
const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

// получаем сделки
const leads = await amoApiClient.getLeads({page: 2, limit: 20});

// отправляем сообщение в чат
const response = await amoJoScopeClient.sendMessage(message);

`````

## Концепция

![](images/scheme.jpg)

### AmoService (domain)

- для обмена токенов

### AmoApiClient (domain, accessToken)

- для взаимодействия с AmoCRM API

### AmoFileClient (accessToken)

- для взаимодействия с File API AmoCRM

### AmoJoChannelClient (channelId, channelSecret)

- для работы с каналом Чат API AmoCRM: создавать/удалять подключения

### AmoJoScopeClient (scopeId, channelSecret)

- для работы с конкретным подключением чата к интеграции Чат API AmoCRM


## amoCRM API

[amo API](https://www.amocrm.ru/developers/content/crm_platform/api-reference)

[chat API](https://www.amocrm.ru/developers/content/chats/chat-api-reference)

[files API](https://www.amocrm.ru/developers/content/files/files-capabilities)
