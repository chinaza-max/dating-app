import { config } from "dotenv";

config();

class ServerConfig {
   NODE_ENV = process.env.NODE_ENV;
   PORT = process.env.PORT;
   DOMAIN = process.env.DOMAIN;


   DB_USERNAME = process.env.DB_USERNAME;
   DB_PASSWORD = process.env.DB_PASSWORD;
   DB_HOST = process.env.DB_HOST;
   DB_PORT = process.env.DB_PORT;
   DB_NAME = process.env.DB_NAME;
   DB_URI = process.env.DB_URI;

   EMAIL_HOST = process.env.EMAIL_HOST;
   EMAIL_PORT = process.env.EMAIL_PORT;
   EMAIL_USER = process.env.EMAIL_USER;
   EMAIL_PASS = process.env.EMAIL_PASS;
   EMAIL_SENDER = process.env.EMAIL_SENDER;


   TOKEN_SECRET=process.env.TOKEN_SECRET;
   TOKEN_ISSUER=process.env.TOKEN_ISSUER;
   TOKEN_EXPIRES_IN=process.env.TOKEN_EXPIRES_IN;
}

export default new ServerConfig();
