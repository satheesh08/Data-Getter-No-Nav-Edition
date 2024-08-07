import { api, track, LightningElement } from 'lwc';
import getObjectDataForSOQL from '@salesforce/apex/NoNavDataGetterUtil.getObjectDataForSOQL';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class NoNavDataGetter extends LightningElement {
    @api soqlQuery;
    @track oldSoqlQuery;
    @api collection = [];
    debounceTimeout = null;
    debounceDelay = 300;

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
        try {
            const result = await getObjectDataForSOQL({ naturalLanguageQuery: this.soqlQuery });
            this.collection = result;
            this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
            this.oldSoqlQuery = this.soqlQuery;
        } catch (error) {
            console.error('Request failed:', error);
        }
    }
}
