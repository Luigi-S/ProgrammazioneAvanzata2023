import { DataTypes } from "sequelize";
import {Food} from './Feed';
import {Order} from './Orders';

import { SingletonDB } from "./sequelize";

const sequelize = SingletonDB.getInstance().getConnection();
const { Op } = require("sequelize");

const Load = sequelize.define(
    "loads",
    {
      foodid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      orderid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
        type: DataTypes.DATEONLY,
        allowNull: true,  
      }
    },
    {
      modelName: "loads",
      timestamps: false,
    }
  );

  Load.belongsTo(Food, {
    foreignKey: 'foodid'
  });
  Food.hasMany(Load, {
    foreignKey: 'foodid'
  });
  Load.belongsTo(Order, {
    foreignKey: 'orderid'
  });
  Order.hasMany(Load, {
    foreignKey: 'orderid',
    onDelete: 'CASCADE',
  });

  export async function createLoads(loads: Array<{foodid: number, orderid: number, requested_q: number, index: number,}>){
    const retval = await Load.bulkCreate(
      loads,
      {validate: true}
    ) 
    return retval;    
  }

  export async function createLoad(food: number, order: number, quantity: number, index: number){
    const retval = await Load.create({foodid:food, orderid:order, requested_q:quantity, index:index});
    return retval;
  }

  // next
  // find the lowest INDEX between all the LOADS with ORDER= orderid and TIMESTAMP=NULL
  export async function getNext(orderid: number) {
    const load = await Load.findOne({
      where: { orderid: orderid, timestamp: null }, // TODO eventually change to actual_d: null
      order: [['index', 'ASC']], // findOne restituirà il solo elemento con index più basso, fra quelli selezionati nella where
      include: Food
    });
    console.log('NEXT');
    console.log( load? load.dataValues : undefined);
    return load? load.dataValues : undefined;
  }

  export async function getLoadsByOrder(orderid: number) {
    const retval:any = await Load.findAll({
      where: { orderid: orderid},
    });

    return retval;
  }

  export async function getCompletedOrder(orderid: number) {
    const retval:any = await Load.findAll({
      where: { orderid: orderid, timestamp: {[Op.ne]:null} },
    });
    return retval;
  }

  export async function getLoadsInPeriod(start?: Date, end?: Date) {
    
    const filter = (start&&end)? {
      timestamp: {[Op.between]:[
        start,
        end,
      ]}
    } : (!start && !end)? { } : 
        (start)? {
          timestamp: {[Op.gt]: start}
        } : { timestamp: {[Op.lt]: end} }
    const retval :any = await Load.findAll({
      where: {
        [Op.and]:[
          {timestamp: {[Op.not]: null}},
          filter
        ]
      },
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
        where:{orderid:order, foodid:food},
      }
    );
    return load;
  }