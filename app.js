import express from 'express';
import cors from 'cors';
import routes from'./src/routes/index.route.js';
import DB from "./src/db/index.js";
import serverConfig from "./src/config/server.js";
import systemMiddleware from "./src/middlewares/system.middleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cron from "node-cron"
import {Subscription,  UserDate} from "./src/db/models/index.js";
import {  Op } from "sequelize";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


class Server {
    constructor(port,mode) {
      this.port = port;
      this.mode = mode;
      this.app = express();
      this.initializeDbAndFirebase();
      this.initializeMiddlewaresAndRoutes();
    }
  
    async initializeDbAndFirebase(){
        await DB.connectDB()

        async function checkIfSubscriptionHasExpired(){
          try {
            // Find all subscriptions
            const subscriptions = await Subscription.findAll({
              where:{
                active:true
              }
            });
            // Update the status for each subscription
            await Promise.all(subscriptions.map(subscription => subscription.updateSubscriptionStatus()));
            
            console.log('Subscription status updated successfully.');
          } catch (error) {
            console.error('Error updating subscription status:', error);
          }
        }

        
        async function checkIfDateAreCompleted(){
          try {
            const Dates = await UserDate.findAll({
              where:{
                [Op.or]: [{dateStatus:null}, {dateStatus:"active"}],
              }
            });

            await Promise.all(Dates.map(date => date.updateDateStatus()));
            console.log('updated date status sucessfully');

          } catch (error) {
            console.error('Error updating date status:', error);
          }
        }



        //'0 0 * * *'
        //'*/10 * * * * *'
  
        cron.schedule('0 0 * * *', () => {
          checkIfSubscriptionHasExpired();
          checkIfDateAreCompleted();

        });

    }
     
    initializeMiddlewaresAndRoutes(){
        let corsOptions
        if(this.mode=='production'){
            const allowedOrigins = ['http://example.com']; // Add your allowed origin(s) here

            corsOptions = {
              origin: function (origin, callback) {
                // Check if the origin is in the allowedOrigins array
                if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
                } else {
                  callback(new Error('Not allowed by CORS'));
                }
              },
            };
        }else{
            corsOptions = {
                origin: '*',
            };
        }

        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(cors(corsOptions));
        this.app.use(routes); 
        this.app.use(systemMiddleware.errorHandler);

    }
  
    start() {

        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
  }
  
  const server = new Server(serverConfig.PORT , serverConfig.NODE_ENV );
  server.start();
  
  