import {
    Model,
    DataTypes
    
  } from "sequelize";
  import serverConfig from "../../config/server.js";



  class Admin extends Model {}

  export function init(connection) {
    Admin.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:serverConfig.NODE_ENV =="development"? `${serverConfig.DOMAIN}/fby-security-api/public/images/avatars/fbyDefaultIMG.png`:`${serverConfig.DOMAIN}/images/avatars/fbyDefaultIMG.png`
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTelValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }, 
      isEmailValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }}
      ,
      {
        tableName: 'Admin',
        sequelize: connection,
        timestamps: true,
      });
  }

export default Admin ;



  

  