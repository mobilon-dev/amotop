// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    
    const contactPayload = amoApiClient.getContactPayload('test', '79135292926');
    console.log('contact payload', contactPayload);

    const response = await amoApiClient.addContact(contactPayload);
    console.log('response', JSON.stringify(response, null, 2));

  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}   

(start)();
