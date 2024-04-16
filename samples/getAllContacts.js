const {AmoApiClient} = require('../dist');
const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

function delay (msec) {
  return new Promise ((resolve, reject) => {
    setTimeout(() => resolve(), msec);
  })
}

const getContacts = async (page = 1, pageCallbackFunction) => {
  const response = await amoApiClient.getContacts({page, limit: 250});
  // console.log('resp', JSON.stringify(response, null, 2));
  if (!response) {
    // console.log('page is empty stop recursive');
    return;
  }
  await pageCallbackFunction(response, page);
  await delay(500);
  return await getContacts(page + 1, pageCallbackFunction);
}

const start = async () => {
  try {
    const pageFunction = (data, page) => {
      console.log('page', page);
      // console.log('data', data);
    }
    await getContacts(1, pageFunction);
  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}

(start)();
