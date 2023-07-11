import { DataTypes } from "sequelize";

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

export enum OrderState {
    CREATO ='CREATO',
    IN_ESECUZIONE ='IN ESECUZIONE',
    FALLITO = 'FALLITO',
    COMPLETATO = 'COMPLETATO',
}

export const Order = sequelize.define(
    "orders",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      state: {
        type: DataTypes.ENUM({values: Object.keys(OrderState)}),
        allowNull: false,
      },
      start: {
        type: DataTypes.TIME,
        allowNull: true,  
      },
      finish: {
        type: DataTypes.TIME,
        allowNull: true,  
      }
    },
    {
      modelName: "orders",
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
    console.log('siamo dentro');
    const retval = await Order.create({state: OrderState.CREATO});
    return retval;
  }

  export async function destroyOrder(id: number){
    const count = await Order.destroy({ where: { id: id } }); 
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