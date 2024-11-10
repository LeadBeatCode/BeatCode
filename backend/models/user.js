import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rank: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Silver",
  },
  subrank: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  BP: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accessToken: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  picture: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  leetcodeCookie: {
    type: DataTypes.STRING(5000),
    allowNull: true,
  },
});
