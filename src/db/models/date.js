import {
    Model,
    DataTypes,

  } from "sequelize";

import serverConfig from "../../config/server.js";
// userId is the person who created or updated  the  UserDate
// userId2 is the person who accepted the UserDate 
class UserDate extends Model {}

export function init(connection) {
  UserDate.init({
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
          'decline',
          'pending'
        ),
        allowNull: false,
        defaultValue:'pending'
      }, 
      dateStatus: {
        type: DataTypes.ENUM(
          'completed',
          'active',
        ),
        allowNull: true,
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
        type: DataTypes.DATE,
        allowNull: false,
      },
      businessIdSpotId: {
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
        defaultValue:false,
      }
    }, {
      tableName: 'UserDate',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }

  UserDate.prototype.updateDateStatus = async function () {

    if (this.fullDate <= new Date()) {
      // If subscription has expired
      this.dateStatus = "completed";
      await this.save();
    }
  };



export default UserDate ;


UserDate.sync({ force: true })
.then(() => {
  console.log('Table dropped successfully.');
})
.catch((error) => {
  console.error('Error dropping table:', error);
});

  