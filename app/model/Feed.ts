import { Model, DataTypes } from "sequelize";
import * as Message from '../utils/messages'

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

// Food model schema
export class Food extends Model{
  public id!: number;
  public quantity!: number;
  public name!: string;
}
  
Food.init(
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
      unique: true,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName:"foods",
    modelName: "Food",
    timestamps: false,
  }
);

/**
 * 
 * @param name 
 * @param quantity 
 *
 * Crea una nuova istanza di Food nel db
 */
export async function createFood (name: string, quantity: number) {
  const retval = await Food.create({name:name, quantity:quantity});
  return retval;
}

// restitutisce la quantità di un dato alimento "id"
export async function getQuantity(id: number) {
  const quantity = await Food.findOne({
    attributes: ["quantity"],
    where: { id: id },
  });
  return quantity;
}

// trova e restituisce alimento associato ad "id", se esiste
export async function getFood(id: number) {
  const food = await Food.findOne({
    where: { id: id },
  });
  return (food)? food.dataValues : undefined;
}

// trova e restitutisce alimento associato a colonna UNIQUE, "name", se esiste
export async function getFoodByName(name: string) {
    const food = await Food.findOne({
      where: { name: name },
    });
    return (food)? food.dataValues : undefined;
}


/**
 * 
 * @param id 
 * @param quantity 
 * @param name 
 * 
 * Aggiorna l'alimento "id", con i nuovi valori specificati in "name" e "quantity", eventualmente anche solo uno dei 2
 * Se nessuno dei 2 parametri è valorizzato, solleverà un'eccezione.
 */
export async function updateFood( id: number, quantity?: number, name?: string) {
  let newVal;
  if(name && quantity){
    newVal = {name: name, quantity: quantity};
  }else if(name){
    newVal = {name: name};
  }else if(quantity){
    newVal = {quantity: quantity};
  }
  if(newVal===undefined){
      throw Error(Message.bad_request_msg.msg);
  }
  const food = await Food.update(
    newVal,
    {
      where: { id: id },
    }
  );
  return food;
}

/**
 * 
 * @param quantity 
 * @param id 
 * 
 * Sottrae alla "quanity" dell'alimento "id", la "qauntity" passata come parametro
 */
export async function takeFood(quantity: number, id: number) {
  await Food.decrement(['quantity'], {by: quantity, where: { id: id } });
}

