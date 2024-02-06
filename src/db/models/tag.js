import { Model, DataTypes } from "sequelize";
import serverConfig from "../../config/server.js";

class Tag extends Model {}

export function init(connection) {
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }
    }, {
      tableName: 'Tag',
      sequelize: connection,
      timestamps: true,
      underscored:false
    });
  }

export default Tag ;


  

  