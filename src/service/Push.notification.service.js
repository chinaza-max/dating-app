
import admin from "firebase-admin";
import {getMessaging} from "firebase-admin/messaging";
import serverConfig from "../config/server.js"




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

    
/*
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
    */

    const serviceAccount = await import('./choice-mi-firebase-adminsdk-kjsq9-f4376d4cf8.json', { assert: { type: 'json' } });


    admin.initializeApp({

      credential: admin.credential.cert({
        "type": serverConfig.FIREBASE_TYPE,
        "project_id": serverConfig.FIREBASE_PROJECT_ID,
        "private_key_id": serverConfig.FIREBASE_PRIVATE_KEY_ID,
        "private_key": serverConfig.FIREBASE_PRIVATE_KEY,
        "client_email": serverConfig.FIREBASE_CLIENT_EMAIL,
        "client_id": serverConfig.FIREBASE_CLIENT_ID,
        "auth_uri":  serverConfig.FIREBASE_AUTH_URI,
        "token_uri": serverConfig.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": serverConfig.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url":  serverConfig.FIREBASE_CLIENT_X509_CERT_URL,
        "universe_domain": serverConfig.FIREBASE_UNIVERSAL_DOMAIN
      }
      )
    });


    const message = {
      notification: {
        title: '$FooCorp up 1.43% on the day',
        body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
      },
      token: `dodCgsXF5h6q8pu7jcKTSE:APA91bHqZ9m8Cp25M-JjSkJ4TwkZvm4q6XYMjPU2i88vcLN8Q9QYYKyizzH5lj--g2VQSwtlrrSJTw0Q9aYPvdk2xKpfNGTFODU4Q1sWIxQ9gGBJyMHPHzdCNdKFPNkqxpN2Uw0DYBps`
    };

    
    const message2 = {
      notification: {
        title: 'choice mi date app',
        body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
      },
      token: `e1C0f4lC5X44xt3aTnRWCE:APA91bFAlvM-1C70d59KNiM7qWNIRijy854fsqYub2o8wVbcMhRbzDURkBCM8INMWOuw_upM8WrjulV9ovv4qoegzyhvt3TZ5tQjyqnG3EWlSsCVGxbpJKmxItQe4k2G8QvLBD_UV2gI`
    };
 
    const array=[message, message2]
    let k=1
    setInterval(() => {
  
      if(k==1){
        k=0
      }
      else{
        k=1
      }
      getMessaging().send(array[k])
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
    



    }, 7000);
  }

  /*
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

  */
}

export default new PushNotificationService();
