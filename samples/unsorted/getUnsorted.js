// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../../dist');

const {domain, accessToken, debug} = require('../_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const unsortedLeads = await amoApiClient.getUnsorted();
    console.log('unsortedLeads', JSON.stringify(unsortedLeads, null, 2));

    const unsortedSummary = await amoApiClient.getUnsortedSummary();
    console.log('summary', JSON.stringify(unsortedSummary, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
