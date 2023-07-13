import { Model, DataTypes } from "sequelize";
import {Food} from './Feed';
import {Order} from './Orders';

import { SingletonDB } from "./sequelize";

const sequelize = SingletonDB.getInstance().getConnection();
const { Op } = require("sequelize");

class Load extends Model {
  public foodid!: number;
  public orderid!: number;
  public index!: number;
  public requested_q!: number;
  public actual_q!: number | null;
  public timestamp!: Date | null;
}

Load.init(
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
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    actual_q: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Load',
    tableName: 'loads',
    timestamps: false,
  }
);

Load.belongsTo(Food, {
  foreignKey: 'foodid',
});
Food.hasMany(Load, {
  foreignKey: 'foodid',
});

Load.belongsTo(Order, {
  foreignKey: 'orderid',
});
Order.hasMany(Load, {
  foreignKey: 'orderid',
  onDelete: 'CASCADE',
});

export default Load;

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

  /**
   * 
   * @param orderid 
   * 
   * Ricava il prossimo carico relativo all'ordine "orderid"
   * Per farlo cerca fra i carichi relativi tale ordine quelli con timestamp nullo, quindi non eseguiti, ricavando solo quello con "index" più basso
   * Nel caso siano stati eseguiti tutti i carichi, restituirà undefined
   */ 
  export async function getNext(orderid: number) {
    // find the lowest INDEX between all the LOADS with ORDER= orderid and TIMESTAMP=NULL
    const load = await Load.findOne({
      where: { orderid: orderid, timestamp: null },
      order: [['index', 'ASC']], // findOne restituirà il solo elemento con index più basso, fra quelli selezionati nella where
      include: Food
    });
    return load? load.dataValues : undefined;
  }

  // seleziona tutti i carichi relativi un ordine "orderdid"
  export async function getLoadsByOrder(orderid: number) {
    const retval:any = await Load.findAll({
      where: { orderid: orderid},
    });

    return retval;
  }

  // seleziona tutti i carichi ESEGUITI relativi un ordine "orderdid"
  export async function getCompletedOrder(orderid: number) {
    const retval:any = await Load.findAll({
      where: { orderid: orderid, timestamp: {[Op.ne]:null} },
    });
    return retval;
  }

  // seleziona tutti i carichi relativi un dato periodo, evetualmente illimitato
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

  /**
   * 
   * @param order 
   * @param food 
   * @param quantity 
   * 
   * Funzione associata all'esecuzione di un carico: specifica la quantità caricata effettivamente, "actual_q", con "quantity"
   * inoltre, assegna il timestamp attuale alla colonna "timestamp"
   */
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