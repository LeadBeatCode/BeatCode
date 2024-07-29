import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  "postgres://postgres:postgres@34.130.23.28:5432/c09Project",
  {
    dialect: "postgres",
  },
);
