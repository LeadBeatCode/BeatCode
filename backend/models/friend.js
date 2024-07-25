import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Friend = sequelize.define("Friend", {
    user1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});