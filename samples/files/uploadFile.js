const {AmoFileClient} = require('../../dist');

const {accessToken, debug} = require('./_config');

const amoFileClient = new AmoFileClient(accessToken, {debug});

const fileName = 'sample.jpg';

const start = async () => {
  try {
    const path = __dirname + '/' + fileName;
    const contentType = 'image/jpeg';
    const result = await amoFileClient.uploadFile(fileName, path, contentType);
    console.log('uuid', result.uuid);
  } catch (err) {
    console.log('err', err);
  }
}   

(start)();



