import { Sequelize } from "sequelize";
import serverConfig from "../config/server.js";
import { init as initModels } from "./models/index.js";


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
      await this.sequelize.sync({ alter: true });
        //await this.sequelize.sync({ force: true });
    } 
  }

}

export default new DB();
