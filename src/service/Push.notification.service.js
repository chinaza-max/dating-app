
import serverConfig from "../config/server.js";
import admin from "firebase-admin";
import {getMessaging} from "firebase-admin/messaging";





class PushNotificationService {
  constructor() {

  }

  async init() {
   
      console.log({"type": serverConfig.FIREBASE_TYPE,
      "project_id": serverConfig.FIREBASE_PROJECT_ID,
      "private_key_id": serverConfig.FIREBASE_PRIVATE_KEY_ID,
      "private_key": serverConfig.FIREBASE_PRIVATE_KEY,
      "client_email": serverConfig.FIREBASE_CLIENT_EMAIL,
      "client_id":serverConfig.FIREBASE_CLIENT_ID,
      "auth_uri": serverConfig.FIREBASE_AUTH_URI,
      "token_uri": serverConfig.FIREBASE_TOKEN_URI,
      "auth_provider_x509_cert_url": serverConfig.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      "client_x509_cert_url": serverConfig.FIREBASE_CLIENT_X509_CERT_URL,
      "universe_domain": serverConfig.FIREBASE_UNIVERSAL_DOMAIN})
    admin.initializeApp({
      credential: admin.credential.cert({
        "type": serverConfig.FIREBASE_TYPE,
        "project_id": serverConfig.FIREBASE_PROJECT_ID,
        "private_key_id": serverConfig.FIREBASE_PRIVATE_KEY_ID,
        "private_key": serverConfig.FIREBASE_PRIVATE_KEY,
        "client_email": serverConfig.FIREBASE_CLIENT_EMAIL,
        "client_id":serverConfig.FIREBASE_CLIENT_ID,
        "auth_uri": serverConfig.FIREBASE_AUTH_URI,
        "token_uri": serverConfig.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": serverConfig.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": serverConfig.FIREBASE_CLIENT_X509_CERT_URL,
        "universe_domain": serverConfig.FIREBASE_UNIVERSAL_DOMAIN
      }),
      projectId:'choice-mi'
    });


    
  }

  async sendMessage() {
    const message = {
      data: {
        score: 'am testing the push notification',
        time: '2:45'
      },
      token: `e1C0f4lC5X44xt3aTnRWCE:APA91bGH07f2UjjBlob1qHOPTkZG0JdDO8-yy5552vbhuritYGScO9vnq0Z9aUdWsAAg79vMYtvTig82ZXRe9PLIMOimZYNRyRLi1Wkvn9KX7un-XlR7yQn3O82SSUJcZS9GMubrm7fq`
    };

  getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

    
  }
}

export default new PushNotificationService();
