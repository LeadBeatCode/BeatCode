import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const LeetcodeQueue = sequelize.define("LeetcodeQueue", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});