import { Model, DataTypes } from "sequelize";
import serverConfig from "../../config/server.js";

class BusinessSpot extends Model {}

export function init(connection) {
  BusinessSpot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openHours: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    closeHours: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availabilty: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    tableName: 'BusinessSpot',
    sequelize: connection,
    timestamps: true,
  });
}

export default BusinessSpot;
