import {
    Model,
    DataTypes
    
  } from "sequelize";


  class MarketingData extends Model {}

  export function init(connection) {
    MarketingData.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }}
      ,
      {
        tableName: 'MarketingData',
        sequelize: connection,
        timestamps: true,
        underscored:false
      });
  }

export default MarketingData ;



  

  