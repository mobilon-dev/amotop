// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('../../dist');

const {domain, accessToken, debug} = require('../_config');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    const params = {
      source_uid: '32542345235',
      source_name: 'mmmm',
      metadata: {
        from: '324234523534',     //!!!! передаем в from, обратно получим в phone
        phone: '79135292926',
        call_responsible: '7495000000',	                    // string|int|null	Кому сделан звонок
                                                            // Можно передавать ID пользователя amoCRM, номер телефона или имя.
        called_at: Math.floor(new Date().getTime() / 1000), // int Когда сделан звонок в формате Unix Timestamp.
        duration: 301,	                                    // int Сколько длился звонок
        link: 'https://records.storage.com/345345345345',	  // string	Ссылка на запись звонка
        service_code:	'mobilon_vpbx',                       // string	Код сервиса, через который сделан звонок
        is_call_event_needed: true,                         // bool	Данный флаг не возвращается в API, но может быть передан. 
                                                            // В случае передачи значения true, в карточку будет добавлено событие о входящем звонке.
        uniq: Math.random(),                                // string
      },
    };

    console.log('params', params);
    const data = await amoApiClient.addUnsortedSip([params]);
    console.log('response', JSON.stringify(data));

    const unsortedLeads = await amoApiClient.getUnsorted();
    console.log('unsortedLeads', JSON.stringify(unsortedLeads, null, 2));

  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
