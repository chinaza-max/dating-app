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
        ),
        allowNull: true,
      },
      bodyType: {
        type: DataTypes.ENUM(
          'pear',
          'round',
          'slim',
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
          'widowed'
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
          'dating'
        ),
        allowNull: true,
      },      
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:true ,
      }
    }, {
      tableName: 'SearchSetting',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }




export default SearchSetting ;



  

  