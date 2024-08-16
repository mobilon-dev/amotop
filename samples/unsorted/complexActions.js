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
    console.log('response', JSON.stringify(data, null, 2));

    const createdLead = data._embedded.unsorted[0]._embedded.leads[0];
    console.log('lead.id', createdLead.id);

    const lead = await amoApiClient.getLeadById(createdLead.id);
    console.log('lead', JSON.stringify(lead, null, 2));

    /// при апдейте сделки неразобранное будет принято на пользователя 
    /// даже если responsible_user_id поставить 0
    const updateLeadData = {
      id: lead.id,
      name: lead.name,
      price: 1000,
      responsible_user_id: 11405170,    // user id пользовать амо
    };
    
    const updatedLead = await amoApiClient.updateLead([updateLeadData])
    console.log('updatedLead', updatedLead);

    const lead2 = await amoApiClient.getLeadById(createdLead.id);
    console.log('lead', JSON.stringify(lead2, null, 2));

  } catch (err) {
    console.log('err', JSON.stringify(err, null, 2));
  }
}   

(start)();
