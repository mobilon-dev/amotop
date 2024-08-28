// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const leadsCustomFields = await amoApiClient.getLeadsCustomFields();
    console.log('leadsCustomFields', JSON.stringify(leadsCustomFields, null, 2));

    const contactsCustomFields = await amoApiClient.getContactsCustomFields();
    console.log('contactsCustomFields', JSON.stringify(contactsCustomFields, null, 2));

    const companiesCustomFields = await amoApiClient.getCompaniesCustomFields();
    console.log('companiesCustomFields', JSON.stringify(companiesCustomFields, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
