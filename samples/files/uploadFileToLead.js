const fs = require('fs');
const {AmoApiClient, AmoFileClient} = require('../../dist');
const axios = require('axios');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});
const amoFileClient = new AmoFileClient(accessToken, {debug});

const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a8/IFL_Small.jpg';
const contactId = 93579227;
const leadId = 28283519;


const start = async () => {
  try {
    // загружаем файл по ссылке
    const file = await axios.get(imgUrl, {responseType: 'arraybuffer'});
    console.log('download success', file.headers);

    // сохраняем содержимое файла на диск
    const fileName = 'sample2.jpg';
    const filePath = __dirname + '/' + fileName;
    const contentType = file.headers['content-type'];
    fs.writeFileSync(filePath, file.data);

    // загружаем файл на драйв амо
    const result = await amoFileClient.uploadFile(fileName, filePath, contentType);
    const fileUUID = result.uuid;
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

