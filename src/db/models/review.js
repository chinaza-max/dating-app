import {

    DataTypes,
    Model
  } from "sequelize";

import serverConfig from "../../config/server.js";
//userId this is who created the Review
//userId this is who is been Reviewed

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
        references: {
          model: 'User', 
          key: 'id',     
        },
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User', 
          key: 'id',     
        },
      },
      DateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Date', 
          key: 'id',     
        },
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
    });
  }


export default Review ;


  

  