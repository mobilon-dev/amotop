// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../dist');

const {domain, accessToken, debug} = require('./_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug: false});

const start = async () => {
  try {    
    const response = await amoApiClient.getPipelines();
    // console.log('count', response._total_items);
    for (let p of response._embedded.pipelines.slice(0, 5)) {
      console.log('pipeline', p.id, p.name);
      const r = await amoApiClient.getPipelineStatuses(p.id);
      // console.log('s', r._total_items);
      for (let s of r._embedded.statuses.slice(0, 20)) {
        console.log('  status', s.id, s.name);
      }
    }
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}

(start)();


/**
 * 

выполнение скрипта 
pipeline 3513949 Интернет-лиды с CRM
  status 34700494 Неразобранное
  status 34700497 Квалификация
  status 39093754 Проведена встреча
  status 34700503 Счет выставлен
  status 142 Успешно реализовано
  status 143 Закрыто и не реализовано
pipeline 5662708 Холодная база
  status 49848229 Неразобранное
  status 54804502 Отобран для звонка
  status 51174619 Разговор с ЛПР
  status 49848235 Встреча назначена
  status 49848319 Счет выставлен
  status 142 Успешно реализовано
  status 143 Закрыто и не реализовано

 */
