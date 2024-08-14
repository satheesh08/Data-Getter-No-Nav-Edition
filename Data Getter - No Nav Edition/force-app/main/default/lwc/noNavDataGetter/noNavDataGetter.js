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
    @api devMode;

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
                if(this.devMode){
                    console.warn('Developer Mode - ON')
                    console.log('Fetching it from the cache for key:'+' '+cacheKey)
                    console.dir(this.collection)
                }
                this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
                return;
            } else {
                this.queryCache.delete(cacheKey);
            }
        }

        this.isLoading = true;
        try {
            const result = await getObjectDataForSOQL({ naturalLanguageQuery: this.soqlQuery });
            this.collection = result.data;
            if(this.devMode){
                console.warn('Developer Mode - ON')
                console.log('Fetching it from OpenAI & Apex'+' '+'New cache block created'+' '+cacheKey)
                console.dir(this.collection)
                console.log('SOQL Query from OpenAI');
                console.log(result.soqlQuery)
            }
            this.queryCache.set(cacheKey, { data: result.data, timestamp: currentTime });
            this.dispatchEvent(new FlowAttributeChangeEvent("collection", this.collection));
        } catch (error) {
            if(this.devMode){
            let errorMessage = 'An unknown error occurred';
            if (error.body && error.body.message) {
                errorMessage = error.body.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            if (errorMessage.startsWith('An error occurred while executing the query:') && this.devMode) {
                const newPrompt = errorMessage.replace('An error occurred while executing the query: ', '');
                console.warn('Developer Mode - ON')
                console.log('Your prompt failed');
                console.log('Here is our new prompt suggestion'+ newPrompt);
            }
        } 
    }
    finally {
            this.isLoading = false;
        }
        this.oldSoqlQuery = this.soqlQuery;
    }

    createCacheKey(query) {
        return `soql_${encodeURIComponent(query)}`;
    }
}
