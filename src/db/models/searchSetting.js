import {
  
    DataTypes,
    Model
  } from "sequelize";

import serverConfig from "../../config/server.js";

class SearchSetting extends Model {}

export function init(connection) {
  SearchSetting.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      ethnicity: {
        type: DataTypes.ENUM(
          'african',
          'hispanic',
          'finnish',
          'american',
          'any'
        ),
        allowNull: true,
      },
      bodyType: {
        type: DataTypes.ENUM(
          'pear',
          'round',
          'slim',
          'any'
        ),
        allowNull: true,
      },
      smoke: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      drinking: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      Distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      maritalStatus: {
        type: DataTypes.ENUM(
          'married',
          'single',
          'divourced',
          'widowed',
          'any'
        ),
        allowNull: true,
      },
      children: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      lookingFor: {
        type: DataTypes.ENUM(
          'friends',
          'networking',
          'marriage',
          'dating',
          'any'
        ),
        allowNull: true,
      },
      searchFilterStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
      },      
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false ,
      }
    }, {
      tableName: 'SearchSetting',
      sequelize: connection,
      timestamps: true,
      underscored:false,
      indexes: [
        {
          unique: true, 
          fields: ['userId'],
        },
      ]
    });
  }




export default SearchSetting ;



  

  