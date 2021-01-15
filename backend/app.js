const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const managerRouter = require('./routes/manager');
const picturesRouter = require('./routes/pictures');
const adminpicturesRouter = require('./routes/adminpictures');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

const bcrypt = require("bcryptjs");
const Manager = require("./schemas/manager");


mongoose.connect(process.env.DB_NAME, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('connected to db');
});



var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/manager', managerRouter);
app.use('/pictures', picturesRouter);
app.use('/adminpictures', adminpicturesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*async function saveManager(){
  console.log("enetered");
  manager = new Manager({
    username: "admin",
    fullname: "admin adminson",
    password: "admin123",
    email: "admin@mail.com"
  });
  
  const salt = await bcrypt.genSalt(10);
  manager.password = await bcrypt.hash(manager.password, salt);
  
  await manager.save();
  console.log("saved manager");
}
saveManager();*/

app.listen(5000);

module.exports = app;