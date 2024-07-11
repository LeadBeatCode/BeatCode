import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://postgres:password@localhost/c09Project", {
    dialect: 'postgres',
});