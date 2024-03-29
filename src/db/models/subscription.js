import {
    DataTypes,
    Model
  } from "sequelize";

class Subscription extends Model {}

export function init(connection) {
  Subscription.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subscriptionPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }, 
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,     
        defaultValue:false ,
      }

    }, {
      tableName: 'Subscription',
      sequelize: connection,
      timestamps: true, 
      underscored:false   
    });
  }

  Subscription.prototype.updateSubscriptionStatus = async function () {

    if (this.endDate <= new Date()) {
      // If subscription has expired
      this.active = false;
      await this.save();
    }
  };


export default Subscription ;



  

  