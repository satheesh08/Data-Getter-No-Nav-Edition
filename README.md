# Data Getter - No Nav Edition 

## Overview

The **Data Getter - No Nav Edition** is a Lightning Web Component (LWC) designed for use in Salesforce Screen Flows. It enables users to execute SOQL queries and display the resulting records on the same screen. This avoids the need for additional navigation, streamlining the user experience.

## Overall Design
![Screenshot (43)](https://github.com/user-attachments/assets/eaa59e9d-e3a4-402a-b8c2-1411d45302bc)

## Features

- **SOQL Query Input**: Allows users to input a general text query directly.
- **Integration**: We use integration to convert the general text to SOQL.
- **Cache Included**: Cache mechanism for improving perfomance .
- **Real-Time Data Display**: Shows query results dynamically on the same screen.

# Prerequisites
## Adding Remote Site Settings for OpenAI API in Salesforce

To configure Salesforce to communicate with the OpenAI API, follow these steps to add a remote site setting.

## Steps to Add Remote Site Settings

1. **Log in to Salesforce:**
   - Go to your Salesforce instance and log in with an account that has administrative privileges.

2. **Navigate to Remote Site Settings:**
   - Click on the **Setup** icon (the gear icon) in the upper right corner.
   - In the quick find box, type `Remote Site Settings` and select it from the dropdown list.

3. **Create a New Remote Site:**
   - Click the **New Remote Site** button.

4. **Fill in the Remote Site Details:**
   - **Remote Site Name:** Enter a name for the remote site. Example: `OpenAI_API`.
   - **Remote Site URL:** Enter `https://api.openai.com`.
     - Ensure you use `https://` for the secure protocol.
   - **Description:** Optionally, add a description such as `Remote site for OpenAI API`.

5. **Save the Remote Site:**
   - Click the **Save** button to create the remote site setting.

6. **Verify the Remote Site Setting:**
   - After saving, you should see the new remote site listed in the Remote Site Settings. You can click on the name to view or edit details if needed.

## Additional Tips

- **Security and Access:** Ensure that the remote site setting matches the OpenAI API URL exactly. The protocol (`https://`) and domain must be correct.
- **Testing Connectivity:** Use an HTTP request tool or write Apex code to test if Salesforce can access the OpenAI API.
- **Apex Integration:** Consider using named credentials for storing authentication securely and simplifying API calls.

By following these steps, you can configure Salesforce to communicate with the OpenAI API. Ensure that the URL and other details are accurate to avoid any issues.

# How to Obtain an OpenAI API Key

To use the OpenAI API, you'll need to obtain an API key. Follow these steps to get your API key from OpenAI.

## Steps to Get Your OpenAI API Key

1. **Sign Up for an OpenAI Account:**
   - Visit the [OpenAI website](https://www.openai.com/).
   - Click on **Sign Up** or **Get Started** to create a new account.
   - Follow the prompts to complete the registration process.

2. **Log In to Your OpenAI Account:**
   - If you already have an account, click on **Log In** on the OpenAI website.
   - Enter your credentials and access your account dashboard.

3. **Navigate to the API Keys Section:**
   - Once logged in, go to the [OpenAI API Dashboard](https://platform.openai.com/account/api-keys).
   - You may be required to verify your email address or complete other security checks before accessing the API keys.

4. **Generate a New API Key:**
   - In the API Keys section, click on **Create New Key** or a similar option.
   - Provide a name or label for the key if prompted (e.g., "My Salesforce Integration").
   - Click **Generate** or **Create** to generate your API key.

5. **Copy Your API Key:**
   - Once generated, your new API key will be displayed on the screen.
   - Click the **Copy** button or manually copy the key to your clipboard.
   - Store this key securely, as it provides access to the OpenAI API.

6. **Use Your API Key:**
   - You can now use the API key in your applications or integrations to authenticate requests to the OpenAI API.

## Security Tips

- **Keep Your API Key Confidential:** Do not share your API key publicly or include it in client-side code.
- **Regenerate Keys if Compromised:** If you believe your API key has been compromised, regenerate it immediately from the OpenAI dashboard.
- **Monitor Usage:** Regularly check your OpenAI usage to ensure there are no unexpected activities.

By following these steps, you'll be able to obtain and securely use your OpenAI API key for accessing the OpenAI services.

## This is a sample implementation with Location object, select different object from the LWCs XML and use the appropriate object in the `fxSOQL` formula field.

## Attachements:

![Screenshot (38)](https://github.com/user-attachments/assets/a151f642-1179-42da-8779-75c763d4c7f8)
![Screenshot (42)](https://github.com/user-attachments/assets/711e1969-d3b8-4388-8e41-4447226cbe17)
![Screenshot (39)](https://github.com/user-attachments/assets/afb6e99e-7244-4131-a15c-2d445a42e339)
![Screenshot (40)](https://github.com/user-attachments/assets/cca5d2b1-db1b-4460-99c5-8ec5d33ca32b)


## Notes:
- If you encounter problems, it could be due to an invalid API key.
- Consider creating a new API key and updating your code with the new key.
- Add more debug statements to help identify and resolve issues.
- Use the test flow available in the `flow` folder for testing purposes.


