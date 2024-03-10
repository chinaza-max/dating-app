import {
    DataTypes,
    Model
  } from "sequelize";


  
  class EmailandTelValidationBusinessSpot extends Model {}

  export function init(connection) {
    EmailandTelValidationBusinessSpot.init({
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
      tableName: 'EmailandTelValidationBusinessSpot',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }



export default EmailandTelValidationBusinessSpot ;



  

  