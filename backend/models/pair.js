import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Pair = sequelize.define("Pair", {
  token1: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  token2: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  p1status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  p2status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  socketId1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  socketId2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
