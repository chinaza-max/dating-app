import {
    Model,
    DataTypes,

  } from "sequelize";

  import serverConfig from "../../config/server.js";

  class UserMatch extends Model {}

  export function init(connection) {
    UserMatch.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false
      }, 
      matchInformation: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      locationCoordinate: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      matchPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false
      }, 
      isMatchRejected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      }, 
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false 
      }
    }, {
      tableName: 'UserMatch',
      sequelize: connection,
      timestamps: true, 
      underscored:false
    });
  }

export default UserMatch ;



  

  