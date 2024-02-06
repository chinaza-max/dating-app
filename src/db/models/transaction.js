import { Model, DataTypes } from 'sequelize';


class Transaction extends Model {}


export function init(connection) {

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      transactionRefId: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('success', 'failed'),
        allowNull: false,
      }, 
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false ,
      }
    },
    {
      tableName: 'Transaction',
        sequelize: connection,
        timestamps: true,
        underscored:false
        
    }
  );

}


export default Transaction;
