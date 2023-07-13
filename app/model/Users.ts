import { Model, DataTypes } from "sequelize";

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

// costo di default di una qualsiasi operazione autorizzata tramite JWT
export const TOKEN_COST: number = 1;

// enum dei ruoli possibili degli user
export enum UserRole {
    Admin =0,
    Generic =1,
}

// User model schema
export class User extends Model{
  public email!: string;
  public token!: number;
  public role!: UserRole;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,  
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

/**
 * 
 * @param email 
 * 
 * Restituisce il numero di "token" dell'utente identificato da "email"
 */
export async function getTokenNumber(email: string) {
  const budget = await User.findOne({
    attributes: ["token"],
    where: { email: email },
  });
  return budget;
}

/**
 * 
 * @param email 
 * 
 * Funzione che restituisce, se esistente, l'utente associato alla "email" indicata
 */
export async function getUser(email: string) {
  const user = await User.findOne({
    where: { email: email },
  });
  return (user)? user.dataValues : undefined;
}

/**
 * 
 * @param newTokenNumber 
 * @param email 
 * 
 * Funzione che aggiorna il valore di "token" a "newTokenNumber" per lo user di id: "email"
 */
export async function updateToken(newTokenNumber: number, email: string) {
  await User.update(
    {
      token: newTokenNumber,
    },
    {
      where: { email: email },
    }
  );
}

/**
 * 
 * @param email 
 * @param amount
 * 
 * Funzione che sottrae al totale "token" dello user identiificato da "email", il valore "amount", che di default vale TOKEN_COST
 */
export function payToken(email: string, amount: number=TOKEN_COST): void{
  User.decrement(['token'], {by: amount, where: { email: email } }
    ).then(()=>{
      return;
    });
}