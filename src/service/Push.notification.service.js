
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
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEpoWgHVtMOGSh\nERmHk8LkyHuBHCpN+p53XAvo1srdGklV4LWdToKyPLehPY8I3oAT1TJoMc0nPO24\niTioqsmIVSVVzRgQTsYhkYHjkhMxRXaittC4rwj6Apf+rwkqcU9+6p4JzJ9XfOxW\n4GF8Rn67W9ZHDJQ/WMyJFJ+h7fHkKq/LU2VIuDegKWBISKySJoCopw7lqOYFeCaV\nXLQBTTGx3iSCiVtOoa9DeXesgG0M0A9vsE9jRbxFYPZPN/RvhOaJzAfHqiAnC5VJ\nZ2M/GA+N+nTPjjOXQwzhG6nIKxXBbwpKumoH6DHS+uCIXwESZBCDA/VpCTQM60EO\nWcPIMgbPAgMBAAECggEAAxmA17I+wyfMZkGHvnxUwRhr4fAYtpvxrX307hmcnvmQ\nGFtvYWhgZQDSACehPomLSUS+A6htTGYIdTUsgHQYsx5sdTrDW1ZyhwrtGjIuPUOU\nCCKLja2snYw26xvFMDcTArQeA5eHF3DvpLrqrnPKAZgD+6C2IX1709lQXtQKUQdY\nG56AE7Gab4i4LmtvsgD6zL/5Ea6osuh5MRR8w/4dhrKTcz3Ydyc6fvC/NmPgiTle\nRtfI+QMoVcu9Ed0w53yWJMND8hSTAvP+y50b7Lr/vBayChrwA+P3v19Ip8inTJa7\nNkxlCDav/tTSvR/5QaSOCB5fbMcnZiHQy6M0WHc7YQKBgQD4wfrJYvoWH+WIwGuO\nABgv/eMsfMswRrt2DEPAPNO4ov271YPubYLwjOIpkdrPPEvtO2kTtFp8AzpanTGa\nDfKuTnmyaojRHIeTkAhEyMTiLrNtkKF1Em91Evxz3pCqUCvpyOsmTwKTJVjmjhJL\nUf2kNMeFtgojOpmtY7cKvU0hnwKBgQDKYC5Oh2bdkFXBcKnKspnjMmFL0cMZOpr2\nCU0Idy7/bIcoCiEBkqLrxmQ3RUAHHR3oKVvZGbKpWK8w+5AzDq1S6PGB4tM42q8w\nqMqKTfLoNUn4bQZ843+ry2Na0js8S9VkJ7Mtw1/99gqp8bJ4YwSdNRsX7tNnvHUI\nhrOUMuXs0QKBgQDrrIv3BCi/kVSbrQG5NOm1fioeWdT/VeQAwTnnBTnpcbJGpNEr\nsOEfGbqje6X8NLoSdfjlTDd1ynEcrFT0CUbkUUEHAdvBke/4o7rRwAyX5Xrk0OPG\n0MJ7/pLjC/evA+m2wj3Wu4BK/FUviWZXqcROMBrf2UndeoViOliOei57LQKBgFYD\nFutNZQzaIXh7t85spjcH3I5q8q6wV9gmD9V/QjxRFgiQdYLDnfbzdPiAuDvNxj48\nBct5vpN3G86HvLvWixfn5W08yGUrnLXjp2Gsy4ahz3SEcfN2hXawlOOu4no4CNPu\ng5r5pLy9a77a+O1tuDJQtdkwKi22zU74YS6li09hAoGBAKkh7NxdZizKwQLpxQ5z\nXcd2MtaZF0L4oo0G6a8Tw0UGfvBRQcLe1lYmTA9FdYCAscW4c8/CWfvXGdIFvc5K\nEYLgt2Zk4rIQJtIOu3Nq0iyQA6qxf6tCE3+1ksQLOBWPHuOCZydFSylXQ0FwgBqY\nFIy7yqnfcsjj+wjGebfWbSKF\n-----END PRIVATE KEY-----\n",
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
      token: `e1C0f4lC5X44xt3aTnRWCE:APA91bFrk-H876GZwAwS_iSdQaxem6gUdved-WbVNcLLHP-kmoBvp1_v-_ZcvkLHdGDr3i7ill_ssWcRj1y6Zwejk9qNEG8jehfiIPLohLpE0ksLICyKYQJuGZ6HqYNr-8XfU1UPsT0p`
    };

    setInterval(() => {
  

      getMessaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
    



    }, 5000);
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
