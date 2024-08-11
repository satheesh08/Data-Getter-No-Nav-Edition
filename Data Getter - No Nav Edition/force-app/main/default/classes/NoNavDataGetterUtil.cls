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
    
    @AuraEnabled(cacheable=true)
    public static List<SObject> getObjectDataForSOQL(String naturalLanguageQuery) {
        String soqlQuery = generateSOQL(naturalLanguageQuery);
        if (String.isNotBlank(soqlQuery)) {
            try {
                return Database.query(soqlQuery);
            } catch (Exception e) {
                return new List<SObject>();
            }
        } else {
            return new List<SObject>();
        }
    }
}
