// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {

  const fieldCode = 'MOBILON_TELEGRAM_NICKNAME';  // большими буквами или цифрами
  
  const contactsResponse = await amoApiClient.getContactsCustomFields();
  console.log('contactsResponse', JSON.stringify(contactsResponse, null, 2));

  const customFields = contactsResponse._embedded.custom_fields;
  console.log('custom fields', customFields.length)

  const field = customFields.find(f => f.code === fieldCode);
  console.log('field', field);

  if(!field) {
    const fields = [
      {
        name: 'Telegram',
        type: 'text',
        code: fieldCode,
      }
    ]
    const response = await amoApiClient.addContactsCustomFields(fields);
    console.log('response', response);
  }

}   

(start)();
