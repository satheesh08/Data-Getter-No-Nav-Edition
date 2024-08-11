import { api, track, LightningElement } from 'lwc';
import getObjectDataForSOQL from '@salesforce/apex/NoNavDataGetterUtil.getObjectDataForSOQL';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class NoNavDataGetter extends LightningElement {
    @api soqlQuery;
    @track oldSoqlQuery;
    @api collection = [];
    debounceTimeout = null;
    debounceDelay = 50; 
    @track isLoading = false; 
    queryCache = new Map(); 

    renderedCallback() {
        if (this.soqlQuery !== this.oldSoqlQuery) {
            this.debounceQueueRequest();
        }
    }

    debounceQueueRequest() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.queueRequest();
        }, this.debounceDelay);
    }

    async queueRequest() {
        if (this.queryCache.has(this.soqlQuery)) {
            this.collection = this.queryCache.get(this.soqlQuery);
            this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
        } else {
            this.isLoading = true; 
            try {
                const result = await getObjectDataForSOQL({ naturalLanguageQuery: this.soqlQuery });
                this.collection = result;
                this.queryCache.set(this.soqlQuery, result);
                this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
            } catch (error) {
                console.error('Request failed:', error);
            } finally {
                this.isLoading = false;
            }
        }
        this.oldSoqlQuery = this.soqlQuery;
    }
}
