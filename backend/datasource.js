import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://postgres:YYyy.6098@localhost/c09Project", {
    dialect: 'postgres',
});