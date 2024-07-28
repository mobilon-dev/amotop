const {AmoFileClient} = require('../../dist');

const {accessToken, debug} = require('./_config');

const amoFileClient = new AmoFileClient(accessToken, {debug});

const start = async () => {
  try {
    const uuid = '70e7be49-b2df-46ef-87c7-b8e16fe8be7';
    const result = await amoFileClient.deleteFileByUUID(uuid);
    console.log('result', result);
  } catch (err) {
    console.log('err', err);
  }
}   

(start)();
