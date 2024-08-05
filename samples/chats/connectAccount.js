const {AmoJoChannelClient, AmoApiClient} = require('../../dist');

const {
  debug,
  channelId,
  channelSecret,
  domain,
  accessToken,
} = require('../_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});
const amoJoChannelClient = new AmoJoChannelClient({channelId, channelSecret, debug});


async function start () {
  // получаем amoJoAccountId
  const account = await amoApiClient.getAccount({amojoId: true});
  const amoJoAccountId = account.amojo_id;
  console.log('amojo account id', amoJoAccountId);

  const response = await amoJoChannelClient.connectChannel(amoJoAccountId, 'канал');
  console.log('response', response);
}

(start)();

// лог
/*
[AmoApiClient][Request] GET https://mobilontestdev.amocrm.ru/api/v4/account {"with":"amojo_id"}
[AmoApiClient][Response] GET https://mobilontestdev.amocrm.ru/api/v4/account {"with":"amojo_id"} 200:OK {"id":31263018,"name":"Мобилон Тест Разработка","subdomain":"mobilontestdev","created_at":1722837652,"created_by":0,"updated_at":1722837652,"updated_by":0,"current_user_id":886363,"country":"RU","currency":"RUB","currency_symbol":"₽","customers_mode":"disabled","is_unsorted_on":true,"mobile_feature_version":0,"is_loss_reason_enabled":true,"is_helpbot_enabled":false,"is_technical_account":true,"contact_name_display_order":1,"amojo_id":"2b13cae0-24f7-4058-b9ad-c13ee05e1b53","_links":{"self":{"href":"https://mobilontestdev.amocrm.ru/api/v4/account"}}}
amojo account id 2b13cae0-24f7-4058-b9ad-c13ee05e1b53
[AmoJoChannelClient][Request] POST https://amojo.amocrm.ru/v2/origin/custom/36f84e98-3cba-422f-85cb-6dd34df7eb5b/connect {"account_id":"2b13cae0-24f7-4058-b9ad-c13ee05e1b53","title":"канал","hook_api_version":"v2"}
[AmoJoChannelClient][Response] POST https://amojo.amocrm.ru/v2/origin/custom/36f84e98-3cba-422f-85cb-6dd34df7eb5b/connect 200:OK {"account_id":"2b13cae0-24f7-4058-b9ad-c13ee05e1b53","scope_id":"36f84e98-3cba-422f-85cb-6dd34df7eb5b_2b13cae0-24f7-4058-b9ad-c13ee05e1b53","title":"канал","hook_api_version":"v2","is_time_window_disabled":false}
response {
  account_id: '2b13cae0-24f7-4058-b9ad-c13ee05e1b53',
  scope_id: '36f84e98-3cba-422f-85cb-6dd34df7eb5b_2b13cae0-24f7-4058-b9ad-c13ee05e1b53',
  title: 'канал',
  hook_api_version: 'v2',
  is_time_window_disabled: false
}

*/
