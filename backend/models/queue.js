import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Queue = sequelize.define("Queue", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
