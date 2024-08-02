const Sequelize = require("sequelize");

const config = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  localOptions: {
    host: process.env.DB_HOST2,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      connectTimeout: 30000, // Increased timeout to 30 seconds
    },
  },
  primaryOptions: {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      connectTimeout: 30000, // Increased timeout to 30 seconds
    },
  },
};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.localOptions
);

const connectToPrimaryDatabase = () => {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.primaryOptions
  );

  return sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Connection to primary database has been established successfully."
      );
    })
    .catch((err) => {
      console.error("Failed to connect to the primary database:", err.message);
      throw err;
    });
};

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to local database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Failed to connect to local database:", err.message);
    console.log("Attempting to connect to the primary database...");
    return connectToPrimaryDatabase();
  });

module.exports = sequelize;
