import { DataTypes } from "sequelize";

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

export enum UserRole {
    Admin =0,
    Generic =1,
}

const User = sequelize.define(
  "users",
  {
    email: {
      type: DataTypes.STRING,
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
    modelName: "users",
    timestamps: false,
  }
);


export async function getTokenNumber(email: string) {
  const budget = await User.findOne({
    attributes: ["token"],
    where: { email: email },
  });
  return budget;
}

export async function getUser(email: string) {
  const user = await User.findOne({
    where: { email: email },
  });
  return user;
}

export async function isRole(role: number, email: string) {
    const user: any = await getUser(email);
    // TODO check if there is a user for this email
    return (user.role === role);
}

export async function updateToken(newTokenNumber: number, email: string) {
  const user = await User.update(
    {
      token: newTokenNumber,
    },
    {
      where: { email: email },
    }
  );
}

export async function payToken(email: string, amount: number=1) {
  await User.decrement(['token'], {by: amount, where: { email: email } });
}