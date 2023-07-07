import { DataTypes } from "sequelize";

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

export async function updateQuantity(newQuantity: number, id: number) {
  const food = await Food.update(
    {
      quantity: newQuantity,
    },
    {
      where: { id: id },
    }
  );
}


// TODO rivedere
export async function takeFood(quantity: number, id: number) {
    let oldQuantity : any = await getQuantity(id);
    if( oldQuantity.quantity >= quantity){
        const newQuantity =  oldQuantity.quantity - quantity;
        const food = await Food.update(
            {
              quantity: newQuantity,
            },
            {
              where: { id: id },
            }
          );
        return true;
    } else{ return false;}
}