import {

    DataTypes,
    Model
  } from "sequelize";

import serverConfig from "../../config/server.js";
class Subscription extends Model {}

export function init(connection) {
  Subscription.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      subscriptionPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
       
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }, 
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }

    }, {
      tableName: 'Subscription',
      sequelize: connection,
      timestamps: true,    
    });
  }



export default Subscription ;



  

  