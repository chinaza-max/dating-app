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
      }, 
      isEmailValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessPicture: {
        type: DataTypes.STRING,
        allowNull: true
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


  