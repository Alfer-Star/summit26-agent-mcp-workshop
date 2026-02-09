var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();
var corsOptions = {
  origin: 'http://localhost:4200',
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./models');

const initialRolesData = require('./initial-data/initial-roles');
const initialUserData = require('./initial-data/initial-user');
const initialProductGroupData = require('./initial-data/initial-product-groups');

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
app.use('/', indexRouter);
require('./routes/product-group.routes')(app);
require('./routes/product.routes')(app);
require('./routes/checkout.routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function initial() {
  initialRolesData.setupInitialRoles();
  initialUserData.setupInitialUser();
  initialProductGroupData.setupInitialProductGroups();
  initialProductGroupData.setupInitialProductGroupGalleryItems();
}
