# Use LinkedIn Sign In with Firebase and also with nodejs

This sample shows how to authenticate using LinkedIn Sign-In on Firebase. In this sample we use OAuth 2.0 based authentication to get LinkedIn user information then create a Firebase Custom Token (using the LinkedIn user ID).


## Setup the sample

Create and setup the Firebase project:
 1. Create a Firebase project using the [Firebase Developer Console](https://console.firebase.google.com).
 1. Enable Billing on your Firebase the project by switching to the **Blaze** plan, this is currently needed to be able to perform HTTP requests to external services from a Cloud Function.

Create and provide a Service Account's credentials:
 1. Create a Service Accounts file as described in the [Server SDK setup instructions](https://firebase.google.com/docs/server/setup#add_firebase_to_your_app).
 1. Save the Service Account credential file as `./functions/service-account.json`

Create and setup your LinkedIn app:
 1. Create a LinkedIn app in the [LinkedIn Developers website](https://www.linkedin.com/developer/apps/).
 1. Add the URL `https://<application-id>.firebaseapp.com/popup.html` to the
    **OAuth 2.0** > **Authorized Redirect URLs** of your LinkedIn app.
 1. Copy the **Client ID** and **Client Secret** of your LinkedIn app and use them to set the `linkedin.client_id` and `linkedin.client_secret` Google Cloud environment variables. For this use:

    ```bash
    firebase functions:config:set linkedin.client_id="yourClientID" linkedin.client_secret="yourClientSecret"
    ```

 > Make sure the LinkedIn Client Secret is always kept secret. For instance do not save this in your version control system.

Deploy your project:
 1. Run `firebase use --add` and choose your Firebase project. This will configure the Firebase CLI to use the correct project locally.
 1. Run `firebase deploy` to effectively deploy the sample. The first time the Functions are deployed the process can take several minutes.

## Run the sample
    step 1.
        ```bash
        npm install
        ```
        ```bash
        yarn
        ```
    step 2.
        ```bash
        npm start
        ```
        ```bash
        yarn start
        ```