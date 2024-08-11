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
    cacheTTL = 5 * 60 * 1000; 

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
        const currentTime = Date.now();
        const cacheKey = this.createCacheKey(this.soqlQuery);

        if (this.queryCache.has(cacheKey)) {
            const cacheEntry = this.queryCache.get(cacheKey);
            if (currentTime - cacheEntry.timestamp < this.cacheTTL) {
                this.collection = cacheEntry.data;
                this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
                return;
            } else {
                this.queryCache.delete(cacheKey);
            }
        }

        this.isLoading = true;
        try {
            const result = await getObjectDataForSOQL({ naturalLanguageQuery: this.soqlQuery });
            this.collection = result;
            this.queryCache.set(cacheKey, { data: result, timestamp: currentTime });
            this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
        } catch (error) {
            console.error('Request failed:', error);
        } finally {
            this.isLoading = false;
        }
        this.oldSoqlQuery = this.soqlQuery;
    }

    createCacheKey(query) {
        return `soql_${encodeURIComponent(query)}`;
    }
}
