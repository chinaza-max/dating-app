import {

    DataTypes,
    Model
  } from "sequelize";

  import serverConfig from "../../config/server.js";
  
  class PartnerPersonaltyQ extends Model {}

  export function init(connection) {
    PartnerPersonaltyQ.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        PartnerPersonaltyQT: {
          type: DataTypes.ENUM(
            'list',
            'checkBox',
            'input'
          ),
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        options: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue:false ,
        },
      }, {
        tableName: 'PartnerPersonaltyQ',
        sequelize: connection,
        timestamps: true, 
        underscored:false
      });
  }


 
export default PartnerPersonaltyQ ;

