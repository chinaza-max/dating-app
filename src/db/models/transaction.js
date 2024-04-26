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
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionRefId: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'ERROR', 'INITIATED'),
        allowNull: false,
        defaultValue: 'INITIATED',
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
