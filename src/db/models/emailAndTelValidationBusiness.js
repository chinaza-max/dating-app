import {

    DataTypes,
    Model
  } from "sequelize";

  import serverConfig from "../../config/server.js";


  class EmailandTelValidationBusiness extends Model {}

  export function init(connection) {
    EmailandTelValidationBusiness.init({
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
      tableName: 'EmailandTelValidationBusiness',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }



export default EmailandTelValidationBusiness ;



  

  