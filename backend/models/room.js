import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Room = sequelize.define("Room", {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPve: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  gameType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  questionTitleSlug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timeElapsed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  problemId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user1Attempts: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user2Attempts: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user1Status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user2Status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  winner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
