import { Model, DataTypes } from "sequelize";
import serverConfig from "../../config/server.js";

class User extends Model {}

export function init(connection) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTelValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }, 
      isEmailValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      countryOfResidence: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maritalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberOfChildren: {
        type: DataTypes.INTEGER, 
        allowNull: true, 
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ethnicity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      religion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      education: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courseOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      occupation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recreationalActivity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      }, 
      personalityQuestionsAnswer: {
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      notification: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }, 
      tags: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }
    }, {
      tableName: 'User',
      sequelize: connection,
      timestamps: true,
    });
  }

export default User ;


  

  