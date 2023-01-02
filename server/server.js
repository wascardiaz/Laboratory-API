if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}
require('rootpath')();
const config = require('./config/env.config.js');
const express = require("express");
var path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { errorHandler } = require('./middleware');
// const cookieSession = require("cookie-session");
const morgan = require("morgan");
var compression = require('compression');

global.__basedir = __dirname;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// var corsOptions = {
//     origin: "http://localhost:4200"
// };
// app.use(cors(corsOptions));

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// enable gzip compression
app.use(compression());

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/// Static files
app.use(express.static(path.join(__dirname, 'public')));

// simple route
// app.get("/", (req, res) => {
//     res.send("Bienvenidos a WDiaz-APP con Express");
// });

// Routes
require('./routes/index.routes')(app);
require('./routes/local-upload.routes')(app);
require('./routes/users.routes')(app);

// API Routes
require('./routes/auth.routes')(app);
require('./routes/title.routes')(app);
require('./routes/user-group.routes')(app);
require('./routes/role.routes')(app);
require('./routes/user.routes')(app);
require('./routes/company.routes')(app);
require('./routes/setting.routes')(app);
require('./routes/upload.routes')(app);
require('./routes/resultado.routes')(app);
require('./routes/test-group.routes')(app);
require('./routes/test.routes')(app);
require('./routes/person-profession.routes')(app);
require('./routes/person_document_type.routes')(app);
require('./routes/person_gender.routes')(app);
require('./routes/person.routes')(app);
require('./routes/person-civil-state.routes')(app);
require('./routes/address-country.routes')(app);
require('./routes/state.routes')(app);
require('./routes/address-city.routes')(app);
require('./routes/ars.routes')(app);
require('./routes/ars-plan.routes')(app);
require('./routes/ars-cobertura.routes')(app);
require('./routes/medic-specialty.routes')(app);

require('./routes/employee.routes')(app);
require('./routes/medic.routes')(app);
require('./routes/customer.routes')(app);
require('./routes/supplier.routes')(app);
require('./routes/distributor.routes')(app);
require('./routes/warehouse.routes')(app);
require('./routes/product.routes')(app);
require('./routes/product-order.routes')(app);
require('./routes/product-order-request.routes')(app);
require('./routes/raw-material.routes')(app);
require('./routes/raw-material-order.routes')(app);
require('./routes/equipment-interface.routes')(app);

//Laboratorio
require('./routes/lab/lab-laboratory.routes')(app);
require('./routes/lab/lab-equipment.routes')(app);
require('./routes/lab/lab-unit.routes')(app);
require('./routes/lab/lab-method.routes')(app);
require('./routes/lab/lab-group-analysis.routes')(app);
require('./routes/lab/lab-sub-group-analysis.routes')(app);
require('./routes/lab/lab-analysis.routes')(app);
require('./routes/lab/lab-analysis-variable-type.routes')(app);
require('./routes/lab/lab-analysis-variable-value.routes')(app);
require('./routes/lab/lab-analysis-variable.routes')(app);
require('./routes/lab/lab-sample-type.routes')(app);
require('./routes/lab/lab-sample-container.routes')(app);
require('./routes/lab/lab-sample-reception.routes')(app);
require('./routes/lab/lab-sample-reception-details.routes')(app);
require('./routes/lab/lab-analysis-result.routes')(app);

// Hospital
require('./routes/hospital/hos-patient-type.routes')(app);
require('./routes/hospital/hos-patient-seguro.routes')(app);
require('./routes/hospital/hos-patient.routes')(app);
require('./routes/hospital/hos-case.routes')(app);
require('./routes/hospital/hos_case_origin.routes')(app);

// set port, listen for requests
app.set("http-port", config.httpPort);
app.set("https-port", config.httpsPort);

// app.use(morgan('dev'));

app.use(errorHandler);

module.exports = app;