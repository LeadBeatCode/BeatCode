import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Room = sequelize.define("Room", {
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId1: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});