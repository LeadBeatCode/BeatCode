import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Room = sequelize.define("Room", {
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token1: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    token2: {
        type: DataTypes.STRING(1000),
        allowNull: false,
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