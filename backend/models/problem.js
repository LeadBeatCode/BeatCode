import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Problem = sequelize.define("Problem", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(2048),
        allowNull: false,
    },
    input1: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    expectedOutput1: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    input2: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    expectedOutput2: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    input3: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    expectedOutput3: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    });