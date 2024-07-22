import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://chelsea:Che1sea1010@localhost:5432/chelsea", {
    dialect: 'postgres',
});