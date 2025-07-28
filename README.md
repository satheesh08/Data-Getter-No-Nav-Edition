# Data Getter - No Nav Edition 

## Overview

The **Data Getter - No Nav Edition** is a Lightning Web Component (LWC) designed for use in Salesforce Screen Flows. It enables users to execute SOQL queries and display the resulting records on the same screen. This avoids the need for additional navigation, streamlining the user experience.

## Overall Design
![Screenshot (49)](https://github.com/user-attachments/assets/c05acbc2-5c14-4f0c-aeb8-c774f6fea626)

## Features

- **SOQL Query Input**: Allows users to input a general text query directly.
- **Integration**: We use integration to convert the general text to SOQL.
- **Cache Included**: Cache mechanism for improving perfomance .
- **Real-Time Data Display**: Shows query results dynamically on the same screen.
- **Debug Mode**: Enable this mode to receive new prompt messages when errors occur, and to access additional console logs for troubleshooting.

# Prerequisites
# How to Obtain an Gemini API Key

To use the Gemini API, you'll need to obtain an API key. Follow these steps to get your API key from Google.

## Steps to Get Your Gemini API Key
🔹  Step 1: Go to Google AI Studio [Google AI Studio](https://aistudio.google.com/app)
   Log in with your Google/Gmail account
🔹  Step 2: Get Your API Key
   Click your Google account icon (top-right corner)
   Choose “Get API Key”
   Click “Create API Key”
   Copy this key — you’ll use it as the x-goog-api-key header for calling Gemini APIs.

You can use my API key since it's free, but I recommend generating your own in case it becomes paid later—you’ll then have full control.

## Security Tips

- **Keep Your API Key Confidential:** Do not share your API key publicly or include it in client-side code.
- **Regenerate Keys if Compromised:** If you believe your API key has been compromised, regenerate it immediately from the Gemini dashboard.
- **Monitor Usage:** Regularly check your Gemini usage to ensure there are no unexpected activities.

By following these steps, you'll be able to obtain and securely use your Gemini API key for accessing the Gemini services.

## Steps to add your API key to the Named Credentials
<img width="1350" height="640" alt="image" src="https://github.com/user-attachments/assets/3f07d8c1-69eb-4c90-8bfe-256b3a754b4a" />

<img width="1361" height="604" alt="image" src="https://github.com/user-attachments/assets/3fe56855-8af6-4b5e-a71e-5b9dd13f923f" />

<img width="1364" height="603" alt="image" src="https://github.com/user-attachments/assets/b3ad9ac8-5b55-494b-afdd-402cec7eb0c7" />



## Adding Remote Site Settings for Gemini API in Salesforce

To configure Salesforce to communicate with the Gemini API, follow these steps to add a remote site setting.

## Steps to Add Remote Site Settings

1. **Log in to Salesforce:**
   - Go to your Salesforce instance and log in with an account that has administrative privileges.

2. **Navigate to Remote Site Settings:**
   - Click on the **Setup** icon (the gear icon) in the upper right corner.
   - In the quick find box, type `Remote Site Settings` and select it from the dropdown list.

3. **Create a New Remote Site:**
   - Click the **New Remote Site** button.

4. **Fill in the Remote Site Details:**
   - **Remote Site Name:** Enter a name for the remote site. Example: `Gemini_2_5_Flash`.
   - **Remote Site URL:** Enter `https://generativelanguage.googleapis.com/`.
     - Ensure you use `https://` for the secure protocol.
   - **Description:** Optionally, add a description such as `Remote site for Gemini API`.

5. **Save the Remote Site:**
   - Click the **Save** button to create the remote site setting.

6. **Verify the Remote Site Setting:**
   - After saving, you should see the new remote site listed in the Remote Site Settings. You can click on the name to view or edit details if needed.

## Additional Tips

- **Security and Access:** Ensure that the remote site setting matches the Gemini API URL exactly. The protocol (`https://`) and domain must be correct.
- **Testing Connectivity:** Use an HTTP request tool or write Apex code to test if Salesforce can access the Gemini API.
- **Apex Integration:** Consider using named credentials for storing authentication securely and simplifying API calls.

By following these steps, you can configure Salesforce to communicate with the Gemini API. Ensure that the URL and other details are accurate to avoid any issues.

## Attachements:

![Screenshot (38)](https://github.com/user-attachments/assets/a151f642-1179-42da-8779-75c763d4c7f8)

-- Here I used Text Template, you can use formula fields/text variables as well.

![Screenshot (45)](https://github.com/user-attachments/assets/eb27f4fc-2cf3-456d-ac83-553067f8158b)

![Screenshot (46)](https://github.com/user-attachments/assets/c19a9ef2-5961-45e7-884d-2a90bb8b1496)

-- Enable Developer Mode by passing true to this XML variable.

![Screenshot (48)](https://github.com/user-attachments/assets/80423be2-9d95-41d3-9bd7-a2b4c130a3f6)

![Screenshot (40)](https://github.com/user-attachments/assets/cca5d2b1-db1b-4460-99c5-8ec5d33ca32b)


## Notes:
- If you encounter problems, it could be due to an invalid API key.
- Consider creating a new API key and updating your code with the new key.
- Add more debug statements to help identify and resolve issues.
- Use the test flow available in the `flow` folder for testing purposes.


