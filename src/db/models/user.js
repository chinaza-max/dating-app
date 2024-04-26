import { Model, DataTypes } from "sequelize";


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
      signUpWith: {
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
        allowNull: true,
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
      countryCodeTel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTelValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
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
        allowNull: true,
      },
      countryOfResidence: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      maritalStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numberOfChildren: {
        type: DataTypes.INTEGER, 
        allowNull: true, 
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ethnicity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      religion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bodyType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      education: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      courseOfStudy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      occupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recreationalActivity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
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
        allowNull: true,
      },
      smoking: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      drinking: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eyeColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hairColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
      },
      fcmToken: {
        type: DataTypes.TEXT,
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
      profileCompleted: {
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



  

  