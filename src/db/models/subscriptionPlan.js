import {

    DataTypes,
    Model
  } from "sequelize";

import serverConfig from "../../config/server.js";

class SubscriptionPlan extends Model {}

export function init(connection) {
  SubscriptionPlan.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT, 
        allowNull: false,
      },
      durationMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: false,
      }, 
      isDisable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }
    }, {
      tableName: 'SubscriptionPlan',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }



export default SubscriptionPlan ;



  

  