import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "postgres://postgres:beA99@localhost:5433/postgres",
  {
    dialect: "postgres",
  },
);
