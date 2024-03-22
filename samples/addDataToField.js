// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const fieldCode = 'MOBILON_TELEGRAM_NICKNAME';

const isExistFieldAndFilledNickname = (contact) => {
  const telegramCFV = contact.custom_fields_values.find(f => f.field_code === fieldCode);
  if (!telegramCFV) {
    return;
  }

  console.log('telegram CFV', telegramCFV);
  const nickname = telegramCFV.values[0]?.value;
  console.log('nickname', nickname);

  if(!nickname) {
    return
  }

  return true;
}


const start = async () => {
  
  try {
    const message = 'sample';
    const contactIdentity = '@antirek';
    const source = 'telegram';

    const contactsResponse = await amoApiClient.getContacts({query: contactIdentity});
    console.log('contactsResponse', JSON.stringify(contactsResponse, null, 2));

    const contacts = contactsResponse._embedded.contacts;
    if(!(contacts && contacts.length > 0)) throw new Error('NO_CONTACTS');
    
    for (const contact of contacts) {
      // console.log('contact', contact.custom_fields_values);
      if (!isExistFieldAndFilledNickname(contact)) {
        console.log('no telegram nickname filled');

        const obj = {
          "custom_fields_values": [
            {
              "field_code": fieldCode,
              "values": [
                {
                  "value": contactIdentity,
                }
              ]
            }
          ]
        };
        const updatedContact = await amoApiClient.updateContact(contact.id, obj);
        console.log('response', updatedContact);
      } else {
        console.log('telegram nickname filled');
      }
    } 
  } catch (err) {
    console.log('err', err);
  }
}   

(start)();
