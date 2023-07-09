import { DataTypes } from "sequelize";
import {Food} from './Feed';
import {Order} from './Orders';

import { SingletonDB } from "./sequelize";

const sequelize = SingletonDB.getInstance().getConnection();
const { Op } = require("sequelize");

export interface LoadSchema{
  food: number; order: number; quantity: number;
}

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

  export async function createLoads(loads: Array<{food: number, order: number, requested_q: number, index: number,}>){
    const retval = await Load.bulkCreate(
      loads,
      {validate: true}
    ) 
    return retval;    
  }

  export async function createLoad(food: number, order: number, quantity: number, index: number){
    const retval = await Load.create({food:food, order:order, requested_q:quantity, index:index});
    return retval;
  }

  // next
  // find the lowest INDEX between all the LOADS with ORDER= ORDER_ID and TIMESTAMP=NULL
  export async function getNext(order_id: number) {
    const load = await Load.findOne({
      where: { order: order_id, timestamp: null }, // TODO eventually change to actual_d: null
      order: ['index', 'ASC'], // findOne restituirà il solo elemento con index più basso, fra quelli selezionati nella where
      include: Food
    });
    return load;
  }

  export async function getLoadsByOrder(order_id: number) {
    const retval = await Load.findAll({
      where: { order: order_id},
    });
    return retval;
  }

  export async function getCompletedOrder(order_id: number) {
    const retval = await Load.findAll({
      where: { order: order_id, timestamp: {[Op.ne]:null} },
    });
    return retval;
  }

  export async function getLoadsInPeriod(start?: Date, end?: Date) {
    const filter = (start&&end)? { timestamp: {[Op.between]:[start,end]} } :
      (!start && !end)? { } : 
      (start)? { timestamp: {[Op.gt]: start} } : { timestamp: {[Op.lt]: end} }
    const retval = await Load.findAll({
      where: filter,
      group: 'order',
      include: Order
    });
    return retval;
  }

  export async function doLoad(order: number, food: number, quantity: number) {
    const load= await Load.update(
      {
        actual_q: quantity,
        timestamp: sequelize.fn('NOW')
      },
      {
        where:{order:order, food:food},
      }
    );
    return load;
  }