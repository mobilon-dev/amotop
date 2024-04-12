import axios, {
  AxiosInstance,
} from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';

import {
  Task,
  Note,
  Tag,
  AmoApiClientOptions,
  GetLeadsParams,
  SourceParams,
  WebhookParams,
  PhoneCallParams,
  GetAccountParams,
  GetTalkParams,
  AddTagParams,
} from './interfaces';

export class AmoApiClient {
  domain: string;
  axios: AxiosInstance;

  constructor(domain: string, accessToken: string, options?: AmoApiClientOptions) {
    if (!domain) {
      throw new Error('ERROR_NO_DOMAIN');
    }
    this.domain = domain;

    if (!accessToken) {
      throw new Error('ERROR_NO_ACCESSTOKEN');
    }

    this.axios = axios.create({
      baseURL: `https://${this.domain}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: options?.timeout || 10000,
    });

    if (options?.debug) {
      const config = {
        prefixText: 'AmoApiClient',
        // status: true,
        headers: false,
        params: true,
      };
      this.axios.interceptors.request.use((request) => {
        return requestLogger(request, config);
      });
      this.axios.interceptors.response.use((response) => {
        return responseLogger(response, config);
      });
    }
  }

  //webhooks
  /**
  * @group Webhooks
  */
  async getWebhooks() {
    return (await this.axios.get('/api/v4/webhooks')).data;
  }

  /**
  * @group Webhooks
  */
  async setWebhook(params: WebhookParams) {
    return (await this.axios.post('/api/v4/webhooks', {
      destination: params.destination,
      settings: params.settings,
    })).data;
  }

  /**
  * список возможных событий
  * зафиксирован в коде (необходимо эпизодически сверяться с документацией на актуальность)
  * @group Webhooks
  * @see https://www.amocrm.ru/developers/content/crm_platform/webhooks-api#webhooks-available-actions
  */
  getWebhookEvents() {
    return [
      'responsible_lead',
      'responsible_contact',
      'responsible_company',
      'responsible_customer',
      'responsible_task',
      'restore_lead',
      'restore_contact',
      'restore_company',
      'add_lead',
      'add_contact',
      'add_company',
      'add_customer',
      'add_talk',
      'add_task',
      'update_lead',
      'update_contact',
      'update_company',
      'update_customer',
      'update_talk',
      'update_task',
      'delete_lead',
      'delete_contact',
      'delete_company',
      'delete_customer',
      'delete_task',
      'status_lead',
      'responsible_lead',
      'note_lead',
      'note_contact',
      'note_company',
      'note_customer',
      'add_chat_template_review',
    ];
  }

  /**
  * @group Webhooks
  */
  async deleteWebhook({destination}: any) {
    return (await this.axios.delete('/api/v4/webhooks', {
      data: {
        destination,
      },
    })).data;
  }

  // account
  /**
  * @group Accounts
  */
  async getAccount(paramIn?: GetAccountParams) {
    let params;
    const withArray = [];
    if (paramIn?.amojo_id) { withArray.push('amojo_id') }
    if (paramIn?.amojoId) { withArray.push('amojo_id') }
    if (paramIn?.version) { withArray.push('version') }
    if (paramIn?.amojoRights) { withArray.push('amojo_rights') }
    if (paramIn?.driveUrl) { withArray.push('drive_url') }
    if (paramIn?.isApiFilterEnabled) { withArray.push('is_api_filter_enabled') }

    const url = '/api/v4/account';

    if (withArray.length > 0) {
      params = {with: withArray.join(',')};
    }

    return (await this.axios.get(url, {params})).data;
  }

  // users

  /**
  * @group Users
  */
  async getUsers() {
    return (await this.axios.get('/api/v4/users')).data;
  }

  /**
  * @group Users
  */
  async getUserById(userId: number) {
    const params = {
      with: 'amojo_id',
    };
    return (await this.axios.get(`/api/v4/users/${userId}`, {params})).data;
  }

  // leads

  /**
  * @group Leads
  */
  async getLeads(params: GetLeadsParams) {
    const page = params?.page ? params?.page : 1;
    const limit = params?.limit ? params?.limit : 50;
    const query = params?.query ? params?.query : null;
    const filter = params?.filter ? params?.filter : null;
    // console.log('filter', filter);
    let url = `/api/v4/leads`;
    url += `?page=${page}&limit=${limit}`;
    if (query) {
      url += `&query=${query}`;
    }
    if (filter) {
      const filterArr = [];
      if (filter.createdAtFrom) { filterArr.push(`filter[created_at][from]=${filter.createdAtFrom}`); }
      if (filter.createdAtTo) { filterArr.push(`filter[created_at][to]=${filter.createdAtTo}`); }
      url += `&` + filterArr.join('&');
    }
    url = encodeURI(url);
    //console.log('url', url);
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Leads
  */
  getBaseLeadPayload (name: string, price: number, createdBy?: number) {
    return {
      name,
      created_by: createdBy ? createdBy : 0,
      price,
    };
  }

  /**
  * @group Leads
  */
  getPipelineLeadPayload (pipelineId: number, statusId?: number) {    
    return {
      pipeline_id: pipelineId,
      status_id: statusId ? statusId : 0,
    };
  }

  /**
  * @group Leads
  * @see https://www.amocrm.ru/developers/content/crm_platform/leads-api#leads-add
  */
  async addLead(leadData: any) {
    const url = `/api/v4/leads`;
    return (await this.axios.post(url, [leadData])).data;
  }

  /**
  * syntax sugar {@link getLinksByEntityType}
  * @group Leads
  */
  async getLeadLinks (leadId: number) {
    if (!leadId) { throw new Error('no lead id'); }
    return await this.getLinksByEntityType('leads', leadId);
  }

  /**
  * syntax sugar {@link getNotesByEntityType}
  * @group Leads
  */
  async getLeadsNotes (params: any) {
    return this.getNotesByEntityType('leads', params);
  }

  /**
  * syntax sugar {@link getTags}
  * @group Contacts
  */
  async getLeadsTags (paramsIn: any) {
    return this.getTags('leads', paramsIn);
  }

  /**
  * syntax sugar {@link addNote}
  * @group Leads
  */
  async addNoteToLead (leadId: number, note: Note) {
    return await this.addNote('leads', leadId, note);
  }

  /**
  * @group Leads
  */
  async getLeadById(leadId: number, params: any) {
    if (!leadId) { throw new Error('no lead id'); }
    const paramWith = params?.contacts ? 'contacts' : null;
    const url = `/api/v4/leads/${leadId}?with=${paramWith}`;
    return (await this.axios.get(url)).data;
  }

  // pipelines
  /**
  * @group Pipelines
  */
  async getPipelines() {
    return (await this.axios.get('/api/v4/leads/pipelines')).data;
  }

  /**
  * @group Pipelines
  */
  async getPipelineById(pipelineId: number) {
    return (await this.axios.get(`/api/v4/leads/pipelines/${pipelineId}`)).data;
  }

  /**
  * @group Pipelines
  */
  async getPipelineStatuses(pipelineId: number) {
    return (await this.axios.get(`/api/v4/leads/pipelines/${pipelineId}/statuses`)).data;
  }

  // tasks
  /**
  * @group Tasks
  */
  async getTasks (paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 250;
    const url = `/api/v4/tasks`;
    const params = {page, limit};
    return (await this.axios.get(url, {params})).data;
  }

  /**
  * @group Tasks
  */
  async getTaskById (taskId: number) {
    return (await this.axios.get(`/api/v4/tasks/${taskId}`)).data;
  }

  /**
  * @group Tasks
  */
  async editTask(taskId: number, data: any) {
    return (await this.axios.patch(`/api/v4/tasks/${taskId}`, {data})).data;
  }

  /**
  * @group Tasks
  */
  async addTask(task: Task) {
    return (await this.axios.post(`/api/v4/tasks`, task)).data;
  }

  // contacts

  /**
  * @group Contacts
  */
  async getContacts (params: any) {
    const page = params?.page ? params?.page : 1;
    const limit = params?.limit ? params?.limit : 50;
    const query = params?.query ? params?.query : null;
    let url = `/api/v4/contacts`;
    url += `?page=${page}&limit=${limit}`;
    if (query) {
      url += `&query=${query}`;
    }
    url = encodeURI(url);
    return (await this.axios.get(url)).data;
  }

  /**
  * syntax sugar {@link addNote}
  * @group Contacts
  */
  async addNoteToContact (contactId: number, note: Note) {
    return await this.addNote('contacts', contactId, note);
  }

  /**
  * @group Contacts
  */
  async getContact (contactId: number, params: any) {
    if (!contactId) { throw new Error('no contact id'); }
    const paramWith = params?.leads ? 'leads' : null;
    const url = `/api/v4/contacts/${contactId}?with=${paramWith}`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Contacts
  */
  async getContactLinks (contactId: number) {
    if (!contactId) { throw new Error('no contact id'); }
    return await this.getLinksByEntityType('contacts', contactId);
  }

  /**
  * @group Entity
  * @see https://www.amocrm.ru/developers/content/crm_platform/entity-links-api#links-list
  */
  async getLinksByEntityType (entityType: string, entityId: number) {
    const url = `/api/v4/${entityType}/${entityId}/links`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Entity
  * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
  */
  async getCustomFieldsByEntityType (entityType: string, params: any) {
    const url = `/api/v4/${entityType}/custom_fields`;
    return (await this.axios.get(url, {params})).data;
  }

  /**
  * syntax sugar {@link getCustomFieldsByEntityType}
  * @group Contacts
  */
  async getContactsCustomFields (paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 50;
    const params = {page, limit};
    return this.getCustomFieldsByEntityType('contacts', params);
  }

  /**
  * @group Contacts
  * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D0%BE%D0%BB%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%BF%D0%BE-%D0%B5%D0%B3%D0%BE-ID
  */
  async getContactsCustomFieldById (customFieldId: string) {
    const url = `/api/v4/contacts/custom_fields/${customFieldId}`;
    return (await this.axios.get(url)).data;
  }

  /**
  * syntax sugar {@link getTags}
  * @group Contacts
  */
  async getContactsTags (paramsIn: any) {
    return this.getTags('contacts', paramsIn);
  }

  /**
  * @group Contacts
  * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D0%B3%D1%80%D1%83%D0%BF%D0%BF-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
  */
  async getContactsCustomFieldGroups () {
    const url = `/api/v4/contacts/custom_fields/groups`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Contacts
  * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%BF%D0%BE-ID-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B
  */
  async getContactsCustomFieldGroupById (groupId: string) {
    const url = `/api/v4/contacts/custom_fields/groups/${groupId}`;
    return (await this.axios.get(url)).data;
  }

  /**
  * syntax sugar {@link addCustomFields}
  * @group Contacts
  */
  async addContactsCustomFields (fields: any[]) {
    return this.addCustomFields('contacts', fields);
  }

  /**
  * @group Contacts
  * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
  */  
  private async addCustomFields (entityType: string, fields: any[]) {
    const url = `/api/v4/${entityType}/custom_fields`;
    return (await this.axios.post(url, fields)).data;
  }

  /**
  * @group Contacts
  */
  async updateContact(id: number, data: object) {
    const url = `/api/v4/contacts/${id}`;
    const response = await this.axios.patch(url, data);
    // console.log('response', response);
    return response.data;
  }

  // async getContactsChats(contactIds: number[], chatIds: string[])
  /**
  * @group Contacts
  */
  async getContactsChats(contactIds: number[]) {
    const contactIdsString = contactIds.join(',');
    const url = `/api/v4/contacts/chats?contact_id=${contactIdsString}`;
    const response = await this.axios.get(url);
    return response.data;
  }

  /**
  * @group Contacts
  */
  async getContactChats(contactId: number) {
    return this.getContactsChats([contactId]);
  }

  /**
  * @group Contacts
  */
  async attachChatToContact(chatId: string, contactId: number) {
    const url = `/api/v4/contacts/chats`;
    const body = JSON.stringify([{contact_id: contactId, chat_id: chatId}]);
    const response = await this.axios.post(url, body);
    return  response.data;
  }

  /**
  * @group Contacts
  */
  async getContactFiles(contactId: number) {
    const url = `/api/v4/contacts/${contactId}/files`;
    const response = await this.axios.get(url);
    return  response.data;
  }

  /**
  * @group Leads
  */
  async getLeadFiles(leadId: number) {
    const url = `/api/v4/leads/${leadId}/files`;
    const response = await this.axios.get(url);
    return  response.data;
  }

  /**
  * @group Contacts
  */
  async linkFileToContact(fileUUID: string, contactId: number) {
    const url = `/api/v4/contacts/${contactId}/files`;
    const response = await this.axios.put(url, [{file_uuid: fileUUID}]);
    return  response.data;
  }

  /**
  * @group Leads
  */
  async linkFileToLead(fileUUID: string, leadId: number) {
    const url = `/api/v4/leads/${leadId}/files`;
    const response = await this.axios.put(url, [{file_uuid: fileUUID}]);
    return  response.data;
  }

  /**
  * @group Companies
  */
  async getCompanies (params: any) {
    const page = params?.page ? params?.page : 1;
    const limit = params?.limit ? params?.limit : 50;
    const query = params?.query ? params?.query : null;
    let url = `/api/v4/companies`;
    url += `?page=${page}&limit=${limit}`;
    if (query) {
      url += `&query=${query}`;
    }
    url = encodeURI(url);
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Companies
  */
  async getCompany (id: number, params: any) {
    if (!id) { throw new Error('no company id'); }
    const paramWith = params?.leads ? 'leads' : null;
    const url = `/api/v4/companies/${id}?with=${paramWith}`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Companies
  * @see https://www.amocrm.ru/developers/content/crm_platform/entity-links-api#links-list
  */
  async getCompanyLinks (companyId: number) {
    if (!companyId) { throw new Error('no company id'); }
    const url = `/api/v4/companies/${companyId}/links`;
    return (await this.axios.get(url)).data;
  }

  // events
  /**
  * @group Events
  * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#events-list
  */
  async getEvents (paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 50;
    const url = `/api/v4/events`;
    const params = {page, limit, with: 'contact_name,lead_name'};
    return (await this.axios.get(url, {params})).data;
  }

  /**
  * @group Events
  * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#events-detail
  */
  async getEventById (eventId: number, paramWith?: any) {
    const params = [];
    if(paramWith?.catalogElements) {params.push('catalog_elements')}
    if(paramWith?.lossReason) {params.push('loss_reason')}
    if(paramWith?.contacts) {params.push('contacts')}

    const url = `/api/v4/events/${eventId}`;
    return (await this.axios.get(url, {params: {with: params.join(',')}})).data;
  }

  /**
  * @group Events
  * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#event-types
  */
  async getEventTypes () {
    const url = `/api/v4/events/types`;
    return (await this.axios.get(url)).data;
  }
  
  /**
  * @group Calls
  * @see https://www.amocrm.ru/developers/content/telephony/call_event
  */
  async notifyPhoneCall (phoneNumber: string, userIds?: number[]) {
    const url = `/api/v2/events`;
    const data = {
      add: [
        {
          type: "phone_call",
          phone_number: phoneNumber,
          users: userIds,
        },
      ],
    };
    return (await this.axios.post(url, data)).data;
  }

  /**
  * @group Calls
  */
  async addPhoneCall (phoneCall: PhoneCallParams) {
    const url = `/api/v4/calls`;

    return (await this.axios.post(url, [phoneCall])).data;
  }

  /**
  * @group Talks
  */
  async getTalks (paramsIn?: GetTalkParams) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 250;
    const params = {page, limit};
    const url = `/api/v4/talks`;
    return (await this.axios.get(url, {params})).data;
  }

  async getUrl (url: string, options: any) {
    return (await this.axios.get(url, options)).data;
  }

  /**
  * @group Talks
  */
  async getTalkById (talkId: number) {
    const url = `/api/v4/talks/${talkId}`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Talks
  */
  async closeTalkById (talkId: number, forceClose?: boolean) {
    const url = `/api/v4/talks/${talkId}/close`;
    const data = {force_close: forceClose};
    return (await this.axios.post(url, data)).data;
  }

  /**
  * @group ShortLinks
  */
  async getShortLinkForContact (url: string, contactId: number) {
    const apiUrl = `/api/v4/short_links`;
    const data = [{
      url,
      metadata: {
        entity_type: "contacts",
        entity_id: contactId,
      }
    }];
    return (await this.axios.post(apiUrl, data)).data;
  }
  
  // notes
  /**
  * @group Notes
  * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#notes-list
  */
  async getNotesByEntityType (entityType: string, paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 250;
    const params = {page, limit};
    return (await this.axios.get(`/api/v4/${entityType}/notes`, {params})).data;
  }

  /**
  * @group Contacts
  */
  async getContactNotes (contactId: number) {
    return this.getNotesByEntityId('contacts', contactId);
  }

  /**
  * @group Contacts
  */
  async getContactNoteById (contactId: number, noteId: number) {
    return this.getNoteById('contacts', contactId, noteId);
  }

  /**
  * syntax sugar {@link getNotesByEntityType}
  * @group Contacts
  */
  async getContactsNotes (params: any) {
    return this.getNotesByEntityType('contacts', params);
  }

  /**
  * @group Notes
  * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#notes-entity-list
  */
  async getNotesByEntityId (entityType: string, entityId: number) {
    return (await this.axios.get(`/api/v4/${entityType}/${entityId}/notes`)).data;
  }

  /**
  * @group Notes
  */
  async getNoteById (entityType: string, entityId: number, noteId: number) {
    return (await this.axios.get(`/api/v4/${entityType}/${entityId}/notes/${noteId}`)).data;
  }

  /**
  * @group Notes
  */
  async addNote (entityType: string, entityId: number, note: Note) {
    return (await this.axios.post(`/api/v4/${entityType}/${entityId}/notes`, {data: note})).data;
  }


  // widgets
  /**
  * @group Widgets
  */
  async getWidgets (params: any) {
    const page = params?.page ? params?.page : 1;
    const limit = params?.limit ? params?.limit : 50;
    let url = `/api/v4/widgets`;
    url += `?page=${page}&limit=${limit}`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Widgets
  */
  async getWidget (widgetCode: string) {
    if (widgetCode === '') {
      throw new Error('ERROR_NO_WIDGET_CODE');
    }
    const url = `/api/v4/widgets/${widgetCode}`;
    return (await this.axios.get(url)).data;
  }


  // sources
  /**
  * @group Sources
  * @see https://www.amocrm.ru/developers/content/crm_platform/sources-api
  */
  async getSources () {
    return (await this.axios.get(`/api/v4/sources`)).data;
  }

  /**
  * @group Sources
  */
  async getSourceById (sourceId: number) {
    return (await this.axios.get(`/api/v4/sources/${sourceId}`)).data;
  }

  /**
  * @group Sources
  */
  async addSource (params: SourceParams) {
    return (await this.axios.post(`/api/v4/sources`, params)).data;
  }

  /**
  * @group Sources
  */
  async deleteSourceById (sourceId: number) {
    return (await this.axios.delete(`/api/v4/sources/${sourceId}`)).data;
  }

  // sales-bot

  async getSalesBots () {
    const url = `/api/v4/bots/`;
    const params = {with: 'launches', page: 1, limit: 50};
    return (await this.axios.get(url, {params})).data;
  }


  // chat templates
  /**
  * @group Templates
  */
  async getTemplates (paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 50;
    const url = `/api/v4/chats/templates`;
    const params = {page, limit};
    return (await this.axios.get(url, {params})).data;
  }

  /**
  * @group Templates
  */
  async getTemplateById (templateId: string) {
    const url = `/api/v4/chats/templates/${templateId}`;
    return (await this.axios.get(url)).data;
  }

  // data = {name, content}
  /**
  * @group Templates
  */
  async updateTemplateById(templateId: string, template: any) {
    const url = `/api/v4/chats/templates/${templateId}`;
    return (await this.axios.patch(url, template)).data;
  }

  // data = {name, content}
  /**
  * @group Templates
  */
  async addTemplate (templates: any) {
    const url = `/api/v4/chats/templates`;
    return (await this.axios.post(url, templates)).data;
  }

  /**
  * @group Templates
  */
  async deleteTemplateById (templateId: string) {
    const url = `/api/v4/chats/templates/${templateId}`;
    return (await this.axios.delete(url)).data;
  }

  /**
  * @group Leads
  */
  async getLeadsWithFilter(params: any, ) {
    const page = params?.page ? params?.page : 1;
    const limit = params?.limit ? params?.limit : 50;
    const query = params?.query ? params?.query : null;
    const filter = params?.filter ? params?.filter : null;
    // console.log('filter', filter);
    let url = `/api/v4/leads`;
    url += `?page=${page}&limit=${limit}`;
    if (query) {
      url += `&query=${query}`;
    }
    if (filter) {
      const filterArr = [];
      if (filter.createdAtFrom) { filterArr.push(`filter[created_at][from]=${filter.createdAtFrom}`); }
      if (filter.createdAtTo) { filterArr.push(`filter[created_at][to]=${filter.createdAtTo}`); }
      url += `&` + filterArr.join('&');
    }
    url = encodeURI(url);
    //console.log('url', url);
    return (await this.axios.get(url)).data;
  }

  //api/v4/{entity_type:leads|contacts|companies|customers}/tags
  /**
  * @group Tags
  * @see https://www.amocrm.ru/developers/content/crm_platform/tags-api#%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D1%82%D0%B5%D0%B3%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
  */
  private async getTags (entityType: string, paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 250;
    const url = `/api/v4/${entityType}/tags`;
    const params = {page, limit};
    return (await this.axios.get(url, {params})).data;
  }

  /**
  * @group Tags for leads
  */
  async getTagsForLeads (paramsIn: any) {
    return this.getTags('leads', paramsIn);
  }

  /**
  * @group Tags
  */
  private async addTag (entityType: string, params: AddTagParams[]) {
    const url = `/api/v4/${entityType}/tags`;
    return (await this.axios.post(url, params)).data;
  }

  /**
  * @group Tags for leads
  */
  async addTagForLeads (tag: AddTagParams) {
    return this.addTag('leads', [tag]);
  }  

  /**
  * @group Tags
  */
  private async appendTags (entityType: string, entityId: number, tags: Tag[]) {
    const url = `/api/v4/${entityType}/${entityId}`;
    const data = {
      id: entityId,
      "_embedded": {tags},
    };
    return (await this.axios.patch(url, data)).data;
  }

  /**
  * @group Tags for leads
  */
  async appendTagsToLead (entityId: number, tags: Tag[]) {
    return this.appendTags('leads', entityId, tags);
  }

  /**
  * @group Unsorted
  * @see https://www.amocrm.ru/developers/content/crm_platform/unsorted-api#unsorted-list
  */
  async getUnsorted (paramsIn: any) {
    const page = paramsIn?.page ? paramsIn?.page : 1;
    const limit = paramsIn?.limit ? paramsIn?.limit : 250;
    const url = `/api/v4/leads/unsorted`;
    const params = {page, limit};
    return (await this.axios.get(url, {params})).data;
  }

  /**
  * @group Unsorted
  * @see https://www.amocrm.ru/developers/content/crm_platform/unsorted-api#unsorted-summary
  */
  async getUnsortedSummary () {
    const url = `/api/v4/leads/unsorted/summary`;
    return (await this.axios.get(url)).data;
  }

  /**
  * @group Unsorted
  * @see https://www.amocrm.ru/developers/content/crm_platform/unsorted-api#unsorted-detail
  */
  async getUnsortedByUID (uid: string) {
    const url = `/api/v4/leads/unsorted/${uid}`;
    return (await this.axios.get(url)).data;
  }
}
