import {

    DataTypes,
    Model
  } from "sequelize";

  import serverConfig from "../../config/server.js";


  class PasswordReset extends Model {}

  export function init(connection) {
    PasswordReset.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resetKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    }, {
      tableName: 'PasswordReset',
      sequelize: connection,
      timestamps: true, 
    });
  }



export default PasswordReset ;



  

  