import { Model, DataTypes } from "sequelize";
import serverConfig from "../../config/server.js";

class UserAnswer extends Model {}

export function init(connection) {
  UserAnswer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      partnerPersonaltyQId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'UserAnswer',
      sequelize: connection,
    }
  );
}

export default UserAnswer;
