import {
    Model,
    DataTypes,

  } from "sequelize";

  import serverConfig from "../../config/server.js";

  class Match extends Model {}

  export function init(connection) {
    Match.init({
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
      matchPercentage: {
        type: DataTypes.STRING,
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
      tableName: 'Match',
      sequelize: connection,
      timestamps: true, 
      underscored:false
    });
  }

export default Match ;



  

  