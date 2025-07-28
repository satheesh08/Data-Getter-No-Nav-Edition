public class NoNavDataGetterUtil {
    @AuraEnabled(cacheable=true)
    public static String generateSOQL(String naturalLanguageQuery) {
        System.debug(naturalLanguageQuery);
        String endpoint = 'https://api.openai.com/v1/chat/completions';
        String GPT_API_KEY =''; 
        
        String requestBody = System.JSON.serialize(new Map<String, Object>{
            'model' => 'gpt-4o-mini',
                'temperature' => 0.2, 
                'messages' => new List<Map<String, String>>{
                    new Map<String, String>{
                        'role' => 'system',
                            'content' => 'You are a tool that converts natural language questions into Salesforce SOQL queries. Given the natural language question, generate the corresponding SOQL query. Make sure the SOQL query is accurate and follows Salesforce\'s query syntax.Provide the result as plain text, without any markdown or extra formatting.'
                            },
                                new Map<String, String>{
                                    'role' => 'user',
                                        'content' => naturalLanguageQuery
                                        }
                }
        });
        System.debug('Request Body: ' + requestBody);
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + GPT_API_KEY);
        req.setBody(requestBody);        
        Http http = new Http();
        HttpResponse res = http.send(req);
        String SOQLQuery='';
        System.debug(res.getBody());
        if (res.getStatusCode() == 200) {
            Map<String, Object> parsedResponse = (Map<String, Object>)System.JSON.deserializeUntyped(res.getBody());
            List<Object> choicesList = (List<Object>) parsedResponse.get('choices'); 
            SOQLQuery = (String) ((Map<String, Object>) ((Map<String, Object>) choicesList.get(0)).get('message')).get('content');
            System.debug(SOQLQuery);
            return SOQLQuery;
        } else {
            return 'Error: ' + res.getBody();
        }
    }
    
    public class QueryResultWrapper {
        @AuraEnabled
        public String soqlQuery { get; set; }
        @AuraEnabled
        public List<SObject> data { get; set; }
        
        public QueryResultWrapper(String soqlQuery, List<SObject> data) {
            this.soqlQuery = soqlQuery;
            this.data = data;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static QueryResultWrapper getObjectDataForSOQL(String naturalLanguageQuery) {
        String soqlQuery = generateSOQL(naturalLanguageQuery);
        if (String.isNotBlank(soqlQuery)) {
            try {
                List<SObject> data = Database.query(soqlQuery);
                return new QueryResultWrapper(soqlQuery, data);
                //return Database.query(soqlQuery);
            } catch (Exception e) {
                String errorMessage = e.getMessage();
                String newPrompt = requestNewSOQLQuery(soqlQuery,naturalLanguageQuery,errorMessage);
                throw new QueryException('An error occurred while executing the query: ' + newPrompt);
            }
        } else {
            throw new QueryException('OpenAI could not return any SOQL for the prompt');
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static String requestNewSOQLQuery(String soqlQuery, String naturalLanguageQuery,String errorMessage) {
        String endpoint = 'https://api.openai.com/v1/chat/completions';
        String GPT_API_KEY =''; 
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + GPT_API_KEY);
        String requestBody = System.JSON.serialize(new Map<String, Object>{
            'model' => 'gpt-4o-mini', // Replace with the correct model name if needed
                'temperature' => 0.2,
                'messages' => new List<Map<String, String>>{
                    new Map<String, String>{
                        'role' => 'system',
                            'content' => 'You are a tool that helps refine prompts for generating accurate Salesforce SOQL queries. Given the following error message and original SOQL query, create a new prompt that can help in generating a corrected SOQL query. The new prompt should be designed to improve the accuracy of the SOQL query generation. Provide the new prompt as plain text, without any markdown or extra formatting.'
                            },
                                new Map<String, String>{
                                    'role' => 'user',
                                        'content' => 'Natural Language Query: ' + naturalLanguageQuery + '\nOriginal SOQL Query: ' + soqlQuery + '\nError Message: ' + errorMessage
                                        }
                }
        });
        req.setBody(requestBody);        
        Http http = new Http();
        HttpResponse res = http.send(req);
        String NewPrompt='';
        if (res.getStatusCode() == 200) {
            Map<String, Object> parsedResponse = (Map<String, Object>)System.JSON.deserializeUntyped(res.getBody());
            List<Object> choicesList = (List<Object>) parsedResponse.get('choices'); 
            NewPrompt = (String) ((Map<String, Object>) ((Map<String, Object>) choicesList.get(0)).get('message')).get('content');
            System.debug(NewPrompt);
            return NewPrompt;
        } else {
            return 'Error: ' + res.getBody();
        }
    }   
}
