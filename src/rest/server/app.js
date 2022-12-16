const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('../middleware/errorHandler');
const { sequelize } = require('../../infrastructure/database/model');
const { bind } = require('./routes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
bind(app);
app.use(errorHandler);

module.exports = app;
