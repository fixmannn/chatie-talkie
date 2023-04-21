require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
  'chatie-talkie',
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

sequelize.authenticate().then(() => {
  console.log('Database connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database', error);
});

module.exports = sequelize;