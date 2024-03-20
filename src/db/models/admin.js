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
        defaultValue:serverConfig.NODE_ENV =="development"? `${serverConfig.DOMAIN}/avatar/download.png`:`${serverConfig.DOMAIN}/images/avatars/download.png`
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTelValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      isEmailValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      fcmToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      disableAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adminType: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
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
        underscored:false
      });
  }

export default Admin ;



  

  