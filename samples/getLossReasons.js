// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const reasons = await amoApiClient.getLossReasons();
    console.log('reasons', JSON.stringify(reasons, null, 2));

  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
