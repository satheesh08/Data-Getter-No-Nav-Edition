public class NoNavDataGetterUtil {
    // === COMMON GEMINI CALL ===
    private static String callGemini(String prompt) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Gemini_2_5_Flash_NC/v1beta/models/gemini-2.0-flash:generateContent');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        Map<String, Object> part = new Map<String, Object>{ 'text' => prompt };
        List<Object> parts = new List<Object>{ part };
        Map<String, Object> content = new Map<String, Object>{ 'parts' => parts };
        List<Object> contents = new List<Object>{ content };
        Map<String, Object> finalPayload = new Map<String, Object>{ 'contents' => contents };
        String jsonBody = JSON.serialize(finalPayload);

        req.setBody(jsonBody);
        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            Map<String, Object> parsed = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> candidates = (List<Object>) parsed.get('candidates');
            if (!candidates.isEmpty()) {
                Map<String, Object> candidate = (Map<String, Object>) candidates.get(0);
                Map<String, Object> content2 = (Map<String, Object>) candidate.get('content');
                List<Object> parts2 = (List<Object>) content2.get('parts');
                if (!parts2.isEmpty()) {
                    Map<String, Object> part2 = (Map<String, Object>) parts2.get(0);
                    return (String) part2.get('text');
                }
            }
            return 'No valid response from Gemini.';
        } else {
            return 'Error: ' + res.getBody();
        }
    }

    @AuraEnabled(cacheable=true)
    public static String generateSOQL(String naturalLanguageQuery) {
        String prompt = 'You are a tool that converts natural language questions into Salesforce SOQL queries. ' +
                        'Given the natural language question "' + naturalLanguageQuery + '", generate the corresponding SOQL query. ' +
                        'Make sure the SOQL query is accurate and follows Salesforce\'s query syntax. ' +
                        'Provide the result as plain text, without any markdown or extra formatting.';
        return callGemini(prompt);
    }

    @AuraEnabled(cacheable=true)
    public static QueryResultWrapper getObjectDataForSOQL(String naturalLanguageQuery) {
        String soqlQuery = generateSOQL(naturalLanguageQuery);
        if (String.isNotBlank(soqlQuery)) {
            try {
                List<SObject> data = Database.query(soqlQuery);
                return new QueryResultWrapper(soqlQuery, data);
            } catch (Exception e) {
                String errorMessage = e.getMessage();
                String newPrompt = requestNewSOQLQuery(soqlQuery, naturalLanguageQuery, errorMessage);
                throw new QueryException('An error occurred while executing the query: ' + newPrompt);
            }
        } else {
            throw new QueryException('Gemini could not return any SOQL for the prompt');
        }
    }

    @AuraEnabled(cacheable=true)
    public static String requestNewSOQLQuery(String soqlQuery, String naturalLanguageQuery, String errorMessage) {
        String prompt = 'You are a tool that helps refine the given prompts "' + naturalLanguageQuery +
                        '" for generating accurate Salesforce SOQL queries. Given the following error message "' +
                        errorMessage + '" and original SOQL query "' + soqlQuery +
                        '", create a new prompt that can help in generating a corrected SOQL query. ' +
                        'The new prompt should be designed to improve the accuracy of the SOQL query generation. ' +
                        'Provide the new prompt as plain text, without any markdown or extra formatting.';
        return callGemini(prompt);
    }

    public class QueryResultWrapper {
        @AuraEnabled public String soqlQuery { get; set; }
        @AuraEnabled public List<SObject> data { get; set; }

        public QueryResultWrapper(String soqlQuery, List<SObject> data) {
            this.soqlQuery = soqlQuery;
            this.data = data;
        }
    }
}
