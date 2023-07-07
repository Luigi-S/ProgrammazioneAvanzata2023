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
        type: DataTypes.ENUM,
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
  

  export async function setState(id: number, state: OrderState) {
    const order = await Order.update(
        {
          state: state,
        },
        {
          where: { id: id },
        }
      );
  }