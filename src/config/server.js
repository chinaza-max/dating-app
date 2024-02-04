import { config } from "dotenv";

config();

class ServerConfig {
   NODE_ENV = process.env.NODE_ENV;
   PORT = process.env.PORT;

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


}

export default new ServerConfig();
