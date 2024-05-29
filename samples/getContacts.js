// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const contacts = await amoApiClient.getContacts();
    console.log('contacts', JSON.stringify(contacts, null, 2));

    const contactsWithLeads = await amoApiClient.getContacts({with: 'leads'});
    console.log('contactsWithLeads', JSON.stringify(contactsWithLeads, null, 2));

    const contactsWithLeadsAndQuery = await amoApiClient.getContacts({with: 'leads', query: 'test'});
    console.log('contactsWithLeadsAndQuery', JSON.stringify(contactsWithLeadsAndQuery, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
