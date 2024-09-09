// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../../dist');

const {domain, accessToken, debug} = require('../_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const phone = '79135292926';

const start = async () => {
  try {

    let response = await amoApiClient.getContacts({with: 'leads', query: phone});
    console.log('response', JSON.stringify(response, null, 2));

    if(response === "") {
      const contactPayload = amoApiClient.getContactPayload('test', phone);
      console.log('contact payload', contactPayload);

      response = await amoApiClient.addContact(contactPayload);
      console.log('response', JSON.stringify(response, null, 2));

      response = await amoApiClient.getContacts({with: 'leads', query: phone});
      console.log('contacts', JSON.stringify(response, null, 2));
    }

    const contact = response._embedded.contacts[0];
    // просто передаем объект сделки
    const lead1 = {
      name: 'Продать слона',
      price: 1000,
      _embedded: {
        contacts: [
          {id: contact.id}
        ],
      },
    };
    console.log('lead payload', lead1);

    const leadResponse1 = await amoApiClient.addLead(lead1);
    console.log('leadResponse', JSON.stringify(leadResponse1, null, 2));

  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}   

(start)();
