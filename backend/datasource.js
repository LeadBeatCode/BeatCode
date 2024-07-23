import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://postgres:PASS@localhost:5432/postgres", {
    dialect: 'postgres',
});