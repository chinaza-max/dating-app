
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
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDhicFc+QU+iR/8\nEeZJ9oKRP1y7vJUSOSof+KUDapKWIHScswMbtYuxHr/6c0PVHLCOQEXSz1q7bJkL\nZB5EjgzLY05TLRJn+5CTc5O/MEj85rEO9h7F8/x5fsEUXvjqRUYSJ7MglkzrKbLD\nMdN+ph0O8tfJC2gdr7GF+SI1Vj18MnCmtsToY9nC9dLMYA36BM9IGNg3F0DpLhJF\nevExmXNtBHKrCFVpVkM8XqB7MXzBSZd/d3UpWljEsA5ELGRriEAoRtR19ibyf/0N\nD2pmiwML/0aNGUAq5B2Z/VGZ+95KrJLEkZN6euJSw/ehi1Eoha1JH+4r2QWehCRO\nZuY3zuvHAgMBAAECggEATuYggVRSG9bfnBBs9fnpIkO+vqRRp/7ceDPFEkVhg2hW\nMw1CrJpdhHhD46sYE0EGmLTuWDmWvZNXlM8Q8Z2Z5zrVxy4wzrSIFrUrfgo3tlVD\non7CNDDO5XfMtsIkpNvYD/jYZrF9thSvxy4ylQ8qgjS8/UVixmPUoBAQAgWp27yn\nI4+VGbor5PhmnIHwWZeEm/8XLdu2SLn7iCH16tX4bdmOZb8r88Aszbp0uX6U8F0c\nuJQsTJAFoWTj1AeP/7W3CORAFbiJzOWVmm8jlLh/qWeBv2mRhYqDuyxU83C3Yp0j\nQFA+cZFYT0CTYHPoyMwUmksw/AcZYy9ldNFEuM49WQKBgQD9ofqb1B+AScwZj2Jm\nhKWLe6qp9/H4pG4Qyxzm1PCeFsSSPbj/HwoCYayjuH6ub6wsaD6yaYVYSo2PA/xb\nSZ2gknc6XcZDaJW2Qi2qH951RP5tBSHEtXrE6nhUGM2ee5+x9QVhgjy5HG9xPLWy\nD3BGu+FhoAKhT79DQG0H5oyzTwKBgQDjpKXpASiiQ31fp0wb3tlHxJhaZeeJpCrH\nZWoJtJaeUs4QMTf7HTly8OP+zfNTEsnGV/sWB3nRM1/1X1Y07EcU6XhLWIOBjRq3\nFCr+vD2/h3GjEbyA6X0NNMZ2HjPLkNlkiEqGPhP86NmKN8xeIZaN+w9QL3K1DtFJ\n5uz1v6oCCQKBgAz2+K56e1m9a/dqgucmpKeqnKCvkejZzt6A42tROzN5inbHPOud\nlI9mmsKLrb4Q60Yh1gKcrjpDJVVIKOAptSr+EaYkIPxVHkIAxADMPDzWWAMOnhlG\nBY6HRbtWwTv2qcUY9ztywtPbhj7NkaQWcfDLrculuDyyrN4tLuWWfV61AoGAfKLn\nG73Aq6bb/AUzDIdk24BuEgB9VsUFjwqdlhbD6IdZv0/TYK/NhnsRua61LKS6yNfe\n517MeZfxT/0UzAEZof96F3as+b9yAw8Nw075V+Ymd6v8U3CDQTnF92Ht5eS2we5F\nL17Jvs0WXjDSui8VqULuTW7NFQi52gaPcrWvtVECgYBBpNZaBt4vm19PAxEVsdyb\nGjDKmlai9TUJ1bZ2G2i3oLxnw7ID+m/JEvVBgk5mK+yUH1LpAl10mRr1OQ4c5Mpu\nCn8jvxWTPKVo7dqRmIagvUHZWPxAqU+Mu+G2YY4xzUVHViqlFHrYOtb/k2HGsC8W\nV4eLhTDrbbtoRi4F+9DfPA==\n-----END PRIVATE KEY-----\n",
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
