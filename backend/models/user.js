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
        type: DataTypes.INTEGER,
        allowNull: true,
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
});