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
      type: DataTypes.TIME,
      allowNull: false,
    },
    closeHours: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:false
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationCoordinate: {
      type: DataTypes.STRING,
      allowNull: true,
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
    underscored:false
  });
}

export default BusinessSpot;
