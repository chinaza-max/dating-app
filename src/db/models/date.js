import {
    Model,
    DataTypes,

  } from "sequelize";

import serverConfig from "../../config/server.js";
// userId is the person who created or updated  the  Date
// userId2 is the person who accepted the Date 
class Date extends Model {}

export function init(connection) {
  Date.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false
      }, 
      usersStatus: {//if the date choosen  has been accepted
        type: DataTypes.ENUM(
          'accepted',
          'pending',
        ),
        allowNull: false,
        defaultValue:'pending'
      }, 
      dateStatus: {
        type: DataTypes.ENUM(
          'completed',
          'active',
          'pending',
        ),
        allowNull: false,
        defaultValue:'pending'
      }, 
      reservationStatus: {
        type: DataTypes.ENUM(
          'accepted',
          'decline',
          'pending'
        ),
        allowNull: false,
        defaultValue:'pending'
      },
      whoAcceptedReservationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fullDate: {
        type: DataTypes.ENUM(
          'accepted',
          'decline'
        ),
        allowNull: true,
      },
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      isnotificationSentToUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },  
      isnotificationSentToReservationSite: {
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
      tableName: 'Date',
      sequelize: connection,
      timestamps: true,
    });
  }




export default Date ;


  

  