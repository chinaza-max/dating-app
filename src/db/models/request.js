import {

    DataTypes,
    Model
  } from "sequelize";

import serverConfig from "../../config/server.js";

// userId is the person who made the first request
// userId2 is the person who accepted the request 

class Request extends Model {}

export function init(connection) {
  Request.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      matchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      status: {
        type: DataTypes.ENUM(
          'accepted',
          'decline',
          'pending'
        ),
        allowNull: false,
        defaultValue:'pending'
      }, 
      isnotificationSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      }, 
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }
    }, {
      tableName: 'Request',
      sequelize: connection,
      timestamps: true,
      underscored:false 
    });
  }


export default Request ;



  

  