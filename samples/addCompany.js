// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    
    const company = {
      name: 'ООО "Новая компания"',
    };

    const response = await amoApiClient.addCompany(company);
    console.log('response', JSON.stringify(response, null, 2));

  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}   

(start)();
