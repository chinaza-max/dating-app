import express from 'express';
import cors from 'cors';
import routes from'./src/routes/index.route.js';
import DB from "./src/db/index.js";
import PushNotificationService from "./src/service/Push.notification.service.js";

import serverConfig from "./src/config/server.js";
import systemMiddleware from "./src/middlewares/system.middleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cron from "node-cron"
import {Subscription,  UserDate,  User} from "./src/db/models/index.js";
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
        await PushNotificationService.init()

       
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


        async function checkAndDeleteUnverifiedRecords() {
          try {
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Subtract 14 days
            
            const unverifiedRecords = await User.findAll({
              where: {
                [Op.or]: [
                  {
                    isEmailValid: false,
                    createdAt: { [Op.lt]: twoWeeksAgo }
                  },
                  {
                    isTelValid: false,
                    createdAt: { [Op.lt]: twoWeeksAgo }
                  }
                ]
              }
            });
      
            if (unverifiedRecords.length > 0) {
              await Promise.all(unverifiedRecords.map(record => record.destroy()));
              console.log('Unverified records older than two weeks have been deleted.');
            } else {
              console.log('No unverified records older than two weeks found.');
            }
          } catch (error) {
            console.error('Error checking and deleting unverified records:', error);
          }
        }


        async function checkAndUpdateRejectedStatus() {
          try {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Subtract 1 month
        
            await UserMatch.update(
              { isMatchRejected: false },
              {
                where: {
                  isMatchRejected: true,
                  createdAt: { [Op.lt]: oneMonthAgo }
                }
              }
            );
        
            console.log('Match rejection status updated successfully.');
          } catch (error) {
            console.error('Error updating match rejection status:', error);
          }
        }
       
        //'0 0 * * *'
        //'*/10 * * * * *'
  
        //The cron expression 0 0 * * * runs every day at midnight (12:00 AM).
        cron.schedule('0 0 * * *', () => {
          checkIfSubscriptionHasExpired();
          checkIfDateAreCompleted();
        });


        //To set up a cron job that runs every two weeks at 4 AM
        cron.schedule('0 4 */14 * *', () => {
          checkAndDeleteUnverifiedRecords()
          checkAndUpdateRejectedStatus()

        });

        cron.schedule('0 12 * * *', () => {
          PushNotificationService.sendPushNotificationForMatch()
        });

        //To set up a cron job that runs every two weeks at 3pm
        cron.schedule('0 15 * * *', () => {
          PushNotificationService.sendPushNotificationForUpComingDate()
        });


    }
     
    initializeMiddlewaresAndRoutes(){
        let corsOptions
        if(this.mode=='production'){


            const allowedOrigins = ['https://choicemi.netlify.app']; // Add your allowed origin(s) here

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
                origin: '*'
            }
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
  
  