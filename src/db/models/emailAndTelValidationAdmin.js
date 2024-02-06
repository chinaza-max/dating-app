import {

    DataTypes,
    Model
  } from "sequelize";

  import serverConfig from "../../config/server.js";


  class EmailandTelValidationAdmin extends Model {}

  export function init(connection) {
    EmailandTelValidationAdmin.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      type: {
        type: DataTypes.ENUM(
          'email',
          'tel'
        ),
        allowNull: false,
      },
      verificationCode: {
        type: DataTypes.INTEGER,
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
      tableName: 'EmailandTelValidationAdmin',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }



export default EmailandTelValidationAdmin ;



  

  