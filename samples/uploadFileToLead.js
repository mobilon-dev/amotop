// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient, AmoFileClient} = require('../dist');
const axios = require('axios');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});
const amoFileClient = new AmoFileClient(accessToken, {debug});

const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a8/IFL_Small.jpg';
const contactId = 12366879;
const leadId = 7260399;

const start = async () => {
  try {
    // загружаем файл по ссылке
    const file = await axios.get(imgUrl, {responseType: 'arraybuffer'});
    console.log('download success', file.headers);

    // создаем сессию
    const data = {
      fileSize: Number(file.headers['content-length']),
      fileName: '1.jpg',
      contentType: file.headers['content-type'],
    };
    console.log('data', data);
    const session = await amoFileClient.createSession(data);
    console.log('session', JSON.stringify(session, null, 2));

    const uploadUrl = session.upload_url;
    // загружаем файл
    const session2 = await amoFileClient.uploadFilePart(uploadUrl, file.data);
    const fileUUID = session2.uuid;
    console.log('file uuid', fileUUID);

    // связка с контактом
    const session3 = await amoApiClient.linkFileToContact(fileUUID, contactId);
    console.log('session3', JSON.stringify(session3, null, 2));

    // связка со сделкой
    const session4 = await amoApiClient.linkFileToLead(fileUUID, leadId);
    console.log('session4', JSON.stringify(session4, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();



