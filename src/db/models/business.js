import {
    Model,
    DataTypes,
   
  } from "sequelize";

import serverConfig from "../../config/server.js";



class Business extends Model {}


export  function init(connection) {
    Business.init({
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
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:false
      }, 
      isEmailValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      }, 
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      isTelValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessId: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"transc"
      },
      availabilty: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      }
    }, 
    
    {
      tableName: 'Business',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }




export default Business ;


  