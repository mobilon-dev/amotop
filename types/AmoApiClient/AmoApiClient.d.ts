import { AxiosInstance } from 'axios';
import { Task, Note, Tag, AmoApiClientOptions, GetLeadsParams, SourceParams, WebhookParams, PhoneCallParams, GetAccountParams, GetTalkParams, AddTagParams } from './interfaces';
export declare class AmoApiClient {
    domain: string;
    axios: AxiosInstance;
    constructor(domain: string, accessToken: string, options?: AmoApiClientOptions);
    /**
    * @group Webhooks
    */
    getWebhooks(): Promise<any>;
    /**
    * @group Webhooks
    */
    setWebhook(params: WebhookParams): Promise<any>;
    /**
    * список возможных событий
    * зафиксирован в коде (необходимо эпизодически сверяться с документацией на актуальность)
    * @group Webhooks
    * @see https://www.amocrm.ru/developers/content/crm_platform/webhooks-api#webhooks-available-actions
    */
    getWebhookEvents(): string[];
    /**
    * @group Webhooks
    */
    deleteWebhook({ destination }: any): Promise<any>;
    /**
    * @group Accounts
    */
    getAccount(paramIn?: GetAccountParams): Promise<any>;
    /**
    * @group Users
    */
    getUsers(): Promise<any>;
    /**
    * @group Users
    */
    getUserById(userId: number): Promise<any>;
    /**
    * @group Leads
    */
    getLeads(params: GetLeadsParams): Promise<any>;
    /**
    * @group Leads
    */
    getBaseLeadPayload(name: string, price: number, createdBy?: number): {
        name: string;
        created_by: number;
        price: number;
    };
    /**
    * @group Leads
    */
    getPipelineLeadPayload(pipelineId: number, statusId?: number): {
        pipeline_id: number;
        status_id: number;
    };
    /**
    * @group Leads
    * @see https://www.amocrm.ru/developers/content/crm_platform/leads-api#leads-add
    */
    addLead(leadData: any): Promise<any>;
    /**
    * @group Leads
    */
    getLeadById(leadId: number, params: any): Promise<any>;
    /**
    * @group Leads
    */
    getLeadLinks(leadId: number): Promise<any>;
    /**
    * @group Pipelines
    */
    getPipelines(): Promise<any>;
    /**
    * @group Pipelines
    */
    getPipelineById(pipelineId: number): Promise<any>;
    /**
    * @group Pipelines
    */
    getPipelineStatuses(pipelineId: number): Promise<any>;
    /**
    * @group Tasks
    */
    getTasks(paramsIn: any): Promise<any>;
    /**
    * @group Tasks
    */
    getTaskById(taskId: number): Promise<any>;
    /**
    * @group Tasks
    */
    editTask(taskId: number, data: any): Promise<any>;
    /**
    * @group Tasks
    */
    addTask(task: Task): Promise<any>;
    /**
    * @group Contacts
    */
    getContacts(params: any): Promise<any>;
    /**
    * @group Contacts
    */
    getContact(contactId: number, params: any): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/entity-links-api#links-list
    */
    getContactLinks(contactId: number): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
    */
    getContactsCustomFields(paramsIn: any): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D0%BE%D0%BB%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%BF%D0%BE-%D0%B5%D0%B3%D0%BE-ID
    */
    getContactsCustomFieldById(customFieldId: string): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/tags-api#%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D1%82%D0%B5%D0%B3%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
    */
    getContactsTags(paramsIn: any): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D0%B3%D1%80%D1%83%D0%BF%D0%BF-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
    */
    getContactsCustomFieldGroups(): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%BF%D0%BE-ID-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B
    */
    getContactsCustomFieldGroupById(groupId: string): Promise<any>;
    /**
    * @group Contacts
    * {@link addCustomFields}
    */
    addContactsCustomFields(fields: any[]): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/custom-fields#%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B8
    */
    private addCustomFields;
    /**
    * @group Contacts
    */
    updateContact(id: number, data: object): Promise<any>;
    /**
    * @group Contacts
    */
    getContactsChats(contactIds: number[]): Promise<any>;
    /**
    * @group Contacts
    */
    getContactChats(contactId: number): Promise<any>;
    /**
    * @group Contacts
    */
    attachChatToContact(chatId: string, contactId: number): Promise<any>;
    /**
    * @group Contacts
    */
    getContactFiles(contactId: number): Promise<any>;
    /**
    * @group Leads
    */
    getLeadFiles(leadId: number): Promise<any>;
    /**
    * @group Contacts
    */
    linkFileToContact(fileUUID: string, contactId: number): Promise<any>;
    /**
    * @group Leads
    */
    linkFileToLead(fileUUID: string, leadId: number): Promise<any>;
    /**
    * @group Companies
    */
    getCompanies(params: any): Promise<any>;
    /**
    * @group Companies
    */
    getCompany(id: number, params: any): Promise<any>;
    /**
    * @group Companies
    * @see https://www.amocrm.ru/developers/content/crm_platform/entity-links-api#links-list
    */
    getCompanyLinks(companyId: number): Promise<any>;
    /**
    * @group Events
    * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#events-list
    */
    getEvents(paramsIn: any): Promise<any>;
    /**
    * @group Events
    * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#events-detail
    */
    getEventById(eventId: number, paramWith?: any): Promise<any>;
    /**
    * @group Events
    * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#event-types
    */
    getEventTypes(): Promise<any>;
    /**
    * @group Calls
    * @see https://www.amocrm.ru/developers/content/telephony/call_event
    */
    notifyPhoneCall(phoneNumber: string, userIds?: number[]): Promise<any>;
    /**
    * @group Calls
    */
    addPhoneCall(phoneCall: PhoneCallParams): Promise<any>;
    /**
    * @group Talks
    */
    getTalks(paramsIn?: GetTalkParams): Promise<any>;
    getUrl(url: string, options: any): Promise<any>;
    /**
    * @group Talks
    */
    getTalkById(talkId: number): Promise<any>;
    /**
    * @group Talks
    */
    closeTalkById(talkId: number, forceClose?: boolean): Promise<any>;
    /**
    * @group ShortLinks
    */
    getShortLinkForContact(url: string, contactId: number): Promise<any>;
    /**
    * @group Notes
    * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#notes-list
    */
    getNotesByEntityType(entityType: string, paramsIn: any): Promise<any>;
    /**
    * @group Contacts
    */
    getContactNotes(contactId: number): Promise<any>;
    /**
    * @group Contacts
    */
    getContactNoteById(contactId: number, noteId: number): Promise<any>;
    /**
    * @group Contacts
    * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#notes-list
    */
    getContactsNotes(params: any): Promise<any>;
    /**
    * @group Notes
    * @see https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#notes-entity-list
    */
    getNotesByEntityId(entityType: string, entityId: number): Promise<any>;
    /**
    * @group Notes
    */
    getNoteById(entityType: string, entityId: number, noteId: number): Promise<any>;
    /**
    * @group Notes
    */
    addNote(entityType: string, entityId: number, note: Note): Promise<any>;
    /**
    * @group Widgets
    */
    getWidgets(params: any): Promise<any>;
    /**
    * @group Widgets
    */
    getWidget(widgetCode: string): Promise<any>;
    /**
    * @group Sources
    */
    getSources(): Promise<any>;
    /**
    * @group Sources
    */
    getSourceById(sourceId: number): Promise<any>;
    /**
    * @group Sources
    */
    addSource(params: SourceParams): Promise<any>;
    /**
    * @group Sources
    */
    deleteSourceById(sourceId: number): Promise<any>;
    getSalesBots(): Promise<any>;
    /**
    * @group Templates
    */
    getTemplates(paramsIn: any): Promise<any>;
    /**
    * @group Templates
    */
    getTemplateById(templateId: string): Promise<any>;
    /**
    * @group Templates
    */
    updateTemplateById(templateId: string, template: any): Promise<any>;
    /**
    * @group Templates
    */
    addTemplate(templates: any): Promise<any>;
    /**
    * @group Templates
    */
    deleteTemplateById(templateId: string): Promise<any>;
    /**
    * @group Leads
    */
    getLeadsWithFilter(params: any): Promise<any>;
    /**
    * @group Tags
    */
    private getTags;
    /**
    * @group Tags for leads
    */
    getTagsForLeads(paramsIn: any): Promise<any>;
    /**
    * @group Tags
    */
    private addTag;
    /**
    * @group Tags for leads
    */
    addTagForLeads(tag: AddTagParams): Promise<any>;
    /**
    * @group Tags
    */
    private appendTags;
    /**
    * @group Tags for leads
    */
    appendTagsToLead(entityId: number, tags: Tag[]): Promise<any>;
    /**
    * @group Unsorted
    * @see https://www.amocrm.ru/developers/content/crm_platform/unsorted-api#unsorted-list
    */
    getUnsorted(paramsIn: any): Promise<any>;
    /**
    * @group Unsorted
    * @see https://www.amocrm.ru/developers/content/crm_platform/unsorted-api#unsorted-summary
    */
    getUnsortedSummary(): Promise<any>;
    /**
    * @group Unsorted
    * @see https://www.amocrm.ru/developers/content/crm_platform/unsorted-api#unsorted-detail
    */
    getUnsortedByUID(uid: string): Promise<any>;
}
