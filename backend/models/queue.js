import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Queue = sequelize.define("Queue", {
    userId1: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});