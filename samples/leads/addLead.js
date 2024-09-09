// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    // просто передаем объект сделки
    const lead1 = {
      name: 'Продать слона',
      price: 1000,
    };
    console.log('lead payload', lead1);

    const leadResponse1 = await amoApiClient.addLead(lead1);
    console.log('leadResponse', JSON.stringify(leadResponse1, null, 2));


    // используем хелперы для payload
    const lead2 = {
      ...amoApiClient.getBaseLeadPayload('Продать слона', 1000),
      ...amoApiClient.getPipelineLeadPayload(7183562, 60002878),
    };
    console.log('lead payload', lead2);

    const leadResponse2 = await amoApiClient.addLead(lead2);
    console.log('leadResponse', JSON.stringify(leadResponse2, null, 2));

  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}   

(start)();


/*

[AmoApiClient][Request] POST https://mobilontestdev.amocrm.ru/api/v4/leads [{"name":"Продать слона","price":1000}]
[AmoApiClient][Response] POST https://mobilontestdev.amocrm.ru/api/v4/leads 200:OK {"_links":{"self":{"href":"https://mobilontestdev.amocrm.ru/api/v4/leads"}},"_embedded":{"leads":[{"id":40885329,"request_id":"0","_links":{"self":{"href":"https://mobilontestdev.amocrm.ru/api/v4/leads/40885329"}}}]}}

*/
