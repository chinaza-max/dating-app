import {
    DataTypes,
    Model
  } from "sequelize";


import serverConfig from "../../config/server.js";


//userId the person who has the wish list
class WishList extends Model {}

export function init(connection) {
  WishList.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      matchId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }, 
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false 
      }
    }, {
      timestamps: true,
      tableName: 'WishList',
      sequelize: connection,
      underscored:false

    });
  }




export default WishList ;


  

  