import { Model, DataTypes } from "sequelize";

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

export enum OrderState {
    CREATO ='CREATO',
    IN_ESECUZIONE ='IN ESECUZIONE',
    FALLITO = 'FALLITO',
    COMPLETATO = 'COMPLETATO',
}

export class Order extends Model {
  public id!: number;
  public state!: OrderState;
  public start!: Date | null;
  public finish!: Date | null;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: DataTypes.ENUM({values: Object.keys(OrderState)}),
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finish: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false,
  }
);
  
  export async function getOrder(id: number) {
    const order = await Order.findOne({
      where: { id: id },
    });
    return (order)? order.dataValues: undefined;
  }

  export async function createOrder(){
    const retval = await Order.create({state: OrderState.CREATO});
    return retval;
  }

  export async function destroyOrder(id: number){
    const count = await Order.destroy({ where: { id: id } }); 
    return count;
  }
  

  export async function setState(id: number, state: OrderState) {
    const order = await Order.update(
      {
        state: state,
      },
      {
        where: { id: id },
      }
    );
    return order;
  }

  export async function takeOrder(id: number) {
    const order = await Order.update(
      {
        state: OrderState.IN_ESECUZIONE,
        start: sequelize.fn('NOW')
      },
      {
        where: { id: id },
      }
    );
    return order;
  }

  export async function finishOrder(id: number) {
    const order = await Order.update(
      {
        state: OrderState.COMPLETATO,
        finish: sequelize.fn('NOW')
      },
      {
        where: { id: id },
      }
    );
    return order;
  }