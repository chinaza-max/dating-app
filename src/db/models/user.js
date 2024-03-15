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
      isImageVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      }, 
      gender: {
        type: DataTypes.ENUM(
          'Male',
          'Female',
          'Others',
        ),
        allowNull: false,
      },
      preferedGender: {
        type: DataTypes.ENUM(
          'Male',
          'Female',
          'Others',
        ),
        allowNull: true,
      },
      relationshipGoal: {
        type: DataTypes.ENUM(
          'Marriage',
          'Dating',
          'New friends',
          'Networking'
        ),
        allowNull: true,
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTelValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,        
      }, 
      isEmailValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
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
        allowNull: false, 
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
      bodyType: {
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
        type: DataTypes.TEXT,
        allowNull: true,
      }, 
      tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      locationCoordinate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      haveChildren: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      smoking: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      drinking: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eyeColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hairColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
      },
      fcmToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disableAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      notificationAllowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
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
      underscored:false
    });
  }

export default User ;


  

  