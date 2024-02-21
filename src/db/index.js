import { Sequelize } from "sequelize";
import serverConfig from "../config/server.js";
import { init as initModels } from "./models/index.js";

import {Date   } from "./models/index.js";



class DB {
   constructor() {
    this.sequelize 

  }

  async connectDB() {

    const options= {
      logging: console.log,
      dialect: "mysql",
      host: serverConfig.DB_HOST,
      username: serverConfig.DB_USERNAME,
      password: serverConfig.DB_PASSWORD,
      port: Number(serverConfig.DB_PORT),
      database: serverConfig.DB_NAME,
      logQueryParameters: true
    };
    
    this.sequelize = new Sequelize(
      serverConfig.DB_NAME,
      serverConfig.DB_USERNAME,
      serverConfig.DB_PASSWORD,
      options
    );

    initModels(this.sequelize);
    if (serverConfig.NODE_ENV === "development") {
      // await this.sequelize.sync({ alter: true });
        //await this.sequelize.sync({ force: true });


        const disableForeignKeyChecks = 'SET foreign_key_checks = 0;';
        const dropTable = 'DROP TABLE IF EXISTS Date;';
        const enableForeignKeyChecks = 'SET foreign_key_checks = 1;';
        
        // Execute SQL commands
        this.sequelize.query(disableForeignKeyChecks)
          .then(() => this.sequelize.query(dropTable))
          .then(() => this.sequelize.query(enableForeignKeyChecks))
          .then(() => {
            console.log('Table dropped successfully.');
          })
          .catch((error) => {
            console.error('Error dropping table:', error);
          });   


          async function getAllTableNames() {
            try {
              const tableNames = await this.sequelize.showAllSchemas();
              console.log('Available table names:', tableNames);
            } catch (error) {
              console.error('Error fetching table names:', error);
            }
          }
          
          // Call the function
          getAllTableNames();
        
        } 


       
  }

}

export default new DB();
