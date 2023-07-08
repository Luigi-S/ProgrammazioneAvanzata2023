import { DataTypes } from "sequelize";
import * as Message from '../utils/messages'

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

export const Food = sequelize.define(
  "feed",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,  
    }
  },
  {
    modelName: "feed",
    timestamps: false,
  }
);

export async function createFood (name: string, quantity: number) {
  const retval = await Food.create({name:name, quantity:quantity});
  return retval;
}

export async function getQuantity(id: number) {
  const quantity = await Food.findOne({
    attributes: ["quantity"],
    where: { id: id },
  });
  return quantity;
}

export async function getFood(id: number) {
  const food = await Food.findOne({
    where: { id: id },
  });
  return food;
}

export async function getFoodByName(name: string) {
    const food = await Food.findOne({
      where: { name: name },
    });
    return food;
}



export async function updateFood( id: number, quantity?: number, name?: string) {
  let newVal;
  if(name){
    newVal = {name: name};
  }
  if(quantity){
    newVal = {quantity: quantity};
  }
  if(newVal===undefined){
      throw Error(Message.bad_request_msg)
  }
  const food = await Food.update(
    newVal,
    {
      where: { id: id },
    }
  );
  return food;
}


// TODO aggiungere check su quantity disponibile?
export async function takeFood(quantity: number, id: number) {
  await Food.decrement(['quantity'], {by: quantity, where: { id: id } });
}