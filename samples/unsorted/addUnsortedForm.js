// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../../dist');

const {domain, accessToken, debug} = require('../_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    

    const params = {
      source_uid: 'tetetet',
      source_name: 'наш сайт',
      metadata: {
        form_id: 'form_feedback',
        form_name: 'Форма обратной связи на сайте',
        form_page: '/feedback',
        ip: '127.0.0.1',
        form_sent_at: Math.floor(new Date().getTime() / 1000),
        referer: 'http://google.com',
      },
    };

    console.log('params', params);
    const data = await amoApiClient.addUnsortedForms([params]);
    console.log('response', JSON.stringify(data));

    const unsortedLeads = await amoApiClient.getUnsorted();
    console.log('unsortedLeads', JSON.stringify(unsortedLeads, null, 2));

  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
