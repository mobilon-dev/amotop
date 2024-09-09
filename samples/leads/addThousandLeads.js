// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

function delay (msec) {
  return new Promise ((resolve, reject) => {
    setTimeout(()=> resolve(), msec);
  })
}

const start = async () => {
  try {
    // const arr = [...Array(3).keys()];
    // for await (let i of arr) {
    for (let i = 0; i < 3; i++) {
      const lead = {
        ...amoApiClient.getBaseLeadPayload('Продать слона', 1000),
        // ...amoApiClient.getPipelineLeadPayload(7915998, 65052502),
      };
      console.log('lead payload', lead);

      const leadResponse = await amoApiClient.addLead(lead);
      console.log('leadResponse', JSON.stringify(leadResponse, null, 2));

      // чтобы не грузить amoCRM запросами
      await delay(500);
    }
  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}

(start)();
