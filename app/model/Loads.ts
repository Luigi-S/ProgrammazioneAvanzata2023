import { DataTypes } from "sequelize";
import {Food} from './Feed';
import {Order} from './Orders';

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

const Load = sequelize.define(
    "loads",
    {
      food: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requested_q: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      actual_q: {
        type: DataTypes.REAL,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.TIME,
        allowNull: true,  
      }
    },
    {
      modelName: "loads",
      timestamps: false,
    }
  );

  Load.belongsTo(Food);
  Food.hasMany(Load, {
    foreignKey: 'food'
  });
  Load.belongsTo(Order);
  Order.hasMany(Load, {
    foreignKey: 'order'
  });

  // next
  // find the lowest INDEX between all the LOADS with ORDER= ORDER_ID and TIMESTAMP=NULL
  export async function getNext(order_id: number) {
    const load = await Load.findOne({
      where: { order: order_id, timestamp: null }, // TODO eventually change to actual_d: null
      order: ['index', 'ASC'] // findOne restituirà il solo elemento con index più basso, fra quelli selezionati nella where
    });
    return load;
  }