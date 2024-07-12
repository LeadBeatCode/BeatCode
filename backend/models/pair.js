import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Pair = sequelize.define("Pair", {
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