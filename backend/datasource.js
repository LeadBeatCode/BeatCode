import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://postgres:PASS@localhost:PORT/postgres", {
    dialect: 'postgres',
});