"use strict";

const fs = require("fs");
const path = require("path");
const tedious = require("tedious");
const mysql = require("mysql2");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const { dialect, dbName, dbConfig } = require("../config/env.config.js").dbCnf;

const db = {};
db.Sequelize = Sequelize;

module.exports = db;

(async () => {
  // create db if it doesn't already exist
  if (dialect === "mssql")
    ensureDbExistsMsSqlDB(dbName)
      .then((r) => {
        console.log(r);
      })
      .catch((e) => console.log("Error: ", e));

  if (dialect === "mysql")
    ensureDbExistsMySqlDB(dbName)
      .then((r) => {
        if (r) console.log(r);
      })
      .catch((e) => console.log("Error: ", e));

  await init();
})();

async function init() {
  // const dialect = dialect;
  const host = dbConfig.server;
  const { userName, password } = dbConfig.authentication.options;
  // Conectamos la base de datos

  const sequelize = new Sequelize(dbName, userName, password, {
    host,
    dialect,
  });

  // Asociaciones y vinculaciones
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-8) === "model.js"
      );
    })
    .forEach((file) => {
      // Inportar Modelos desde los archivos en la carpeta __dirname
      // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
      const model = sequelize["import"](path.join(__dirname, file));
      // const model = sequelize['define'](path.join(__dirname, file));
      // console.log(model.name)
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      // console.log(modelName)
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // await db.sequelize.authenticate();
  // await sequelize.sync({ force: true });
}

async function ensureDbExistsMsSqlDB(dbname) {
  return new Promise((resolve, reject) => {
    // console.log('Creando la base de datos...')
    const connection = new tedious.Connection(dbConfig);

    connection.connect((err) => {
      if (err) {
        // console.error(err);
        reject(`Ha fallado la conexon con el motor SQL SERVER: ${err.message}`);
      }

      const createDbQuery = `IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbname}') CREATE DATABASE [${dbname}];`;
      const request = new tedious.Request(createDbQuery, (err) => {
        if (err) {
          // console.error(err);
          reject(
            `No se pudo crear la base de datos SQL ${dbname}: ${err.message}`
          );
        }

        // query executed successfully
        resolve(`La base de datos SQL ${dbname} ha sido creada.`);
      });

      connection.execSql(request);
    });
  });
}

async function ensureDbExistsMySqlDB(dbname) {
  return new Promise((resolve, reject) => {
    const host = dbConfig.server;
    const { userName, password } = dbConfig.authentication.options;
    const conn = mysql.createConnection({
      host: host,
      user: userName,
      password: password,
    });

    conn.connect(function (err) {
      if (err) {
        // console.error(err);
        reject(`Ha fallado la conexon con el motor MySQL: ${err.message}`);
      }

      conn.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbname}\`;`,
        function (err, result) {
          if (err) {
            reject(
              `Query para crean base de datos MySql ${dbname} ha fallado: ${err.message}`
            );
          }
          // console.log(result)
          const resultText =
            result.affectedRows > 0
              ? `La base de datos MySql ${dbname} ha sido creada.`
              : `Base de datos MySql ${dbname} confirmada.`;
          resolve(resultText);
        }
      );
    });
  });
}
