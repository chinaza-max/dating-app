import {

    DataTypes,
    Model
  } from "sequelize";

import serverConfig from "../../config/server.js";


class Review extends Model {}

export function init(connection) {
  Review.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }, 
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      star: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      comment: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }
    }, {
      tableName: 'Review',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }


export default Review ;


  

  