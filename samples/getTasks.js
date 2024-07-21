// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');
// const moment = require('moment');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const tasks = await amoApiClient.getTasks();
    console.log('tasks', JSON.stringify(tasks, null, 2));

    const task = {
      text: 'test task',
      complete_till: 1721539039, // moment().unix(),  unixtime
      entity_id: 28283519,
      entity_type: 'leads',
    }

    const response = await amoApiClient.addTask([task]);
    console.log('add task response', response);
  } catch (err) {
    console.log('err', err);
  }
}   

(start)();
