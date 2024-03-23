// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const contactId = 12366879;
const leadId = 7260399;

const start = async () => {
  try {
    // получаем список файлов контакта
    const session3 = await amoApiClient.getContactFiles(contactId);
    console.log('session3', JSON.stringify(session3, null, 2));

    // связка со сделкой
    const session4 = await amoApiClient.getLeadFiles(leadId);
    console.log('session4', JSON.stringify(session4, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
