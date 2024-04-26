// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug: true});

const start = async () => {
  try {    
    const response = await amoApiClient.getAccount({taskTypes: true});
    console.log(response._embedded.task_types);
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}

(start)();
