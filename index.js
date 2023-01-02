const app = require("./server/server");
const db = require("./server/models");

var debug = require("debug")("photo-uploader-app:server");

const initial = require("./data");

var fs = require("fs");
var http = require("http");
var https = require("https");

const bcrypt = require("bcryptjs");

const hostname = "coie.ddns.net";

var privateKey = fs.readFileSync("./coie.ddns.net/key.key", "utf8");
var certificate = fs.readFileSync("./coie.ddns.net/cert.crt", "utf8");
var caCertificate = fs.readFileSync("./coie.ddns.net/ca_bundle.crt", "utf8");

var credentials = { key: privateKey, cert: certificate, ca: caCertificate };

// set port, listen for requests
// app.set("http-port", config.httpPort);
// app.set("https-port", config.httpsPort);
app.set("http-port", normalizePort(app.get("http-port")));

const httpServer = http.createServer(app);

/* Redirecting to HTTPS */
// const httpServer = http.createServer((req, res) => {
//     res.statusCode = 301;
//     res.setHeader('Location', `https://${hostname}${req.url}`);
//     res.end(); // make sure to call send() or end() to send the response
//  });

app.set("https-port", normalizePort(app.get("https-port")));

const httpsServer = https.createServer(credentials, app);

async function assertDatabaseConnectionOk() {
  console.log(`Verificando Conexion a la base de datos...`);
  return new Promise(async (resolve) => {
    try {
      await db;
      // await db.sequelize.authenticate();
      // await db.sequelize.sync(/* { force: true } */).then(async () => {
      //     // console.log('Drop and Resync Database with { force: true }');
      //     if ((await db.user.count()) === 0) {
      //         await initial();
      //         const firstUser = {
      //             username: 'wdadm',
      //             emailId: 'wascar_diaz@hotmail.com',
      //             passwordHash: await bcrypt.hash('salesiano', 10),
      //             // verificationToken: randomTokenString(),
      //             acceptTerms: '1',
      //             verified: new Date(Date.now())
      //         }
      //         const adminRole = await db.role.findOne({ where: { name: 'Admin' } })
      //         firstUser.roleId = adminRole ? adminRole.id : firstUser.roleId;
      //         await db.user.create(firstUser)/* .then(async u => await sendVerificationEmail(u, origin)) */.catch(e => console.log(e));
      //     }
      // });

      // resolve('Base de Datos Conectada!');
      resolve();
    } catch (error) {
      console.log("Error: No se ha podido conectar:", error.message);
      process.exit(1);
    }
  });
}

async function init() {
  await assertDatabaseConnectionOk().then(() => {
    // Server is listening http
    httpServer.listen(app.get("http-port"), () => {
      console.log("Http Server listen on port", app.get("http-port"));
      console.log("Environment:", process.env.NODE_ENV || "Development");
    });

    httpServer.on("error", onError);
    httpServer.on("listening", onListening);

    // Server is listening https
    httpsServer.listen(app.get("https-port"), () => {
      console.log("Https Server listen on port", app.get("https-port"));
      console.log("Environment:", process.env.NODE_ENV || "Development");
    });

    httpsServer.on("error", onError);
    httpsServer.on("listening", onListening);
  });
}

init();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
