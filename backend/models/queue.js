import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Queue = sequelize.define("Queue", {
    accessToken: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});