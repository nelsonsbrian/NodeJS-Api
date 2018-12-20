const debug = require('debug')('app:startup');
const config = require('config'); //allows for config files based on different environments dev/production
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const genres = require('/routes/genres');
const home = require('./routes/home');
app.set('view engine', 'pug');
app.set('views', './views'); //default - optional setting

app.use(express.json()); //parses req.body into JSON data
app.use(express.urlencoded({ extended: true })); //key=value&ke=value req.body into JSON data
app.use(express.static('public')); //middleware for static folders - serve static content to from root parameter to extact url. localhost:3000/readme.txt
app.use(helmet()); //Help secure Express apps with various HTTP headers 
app.use(logger); //custom middleware in logger.js
app.use('/api/courses', courses);
app.use('/api/genres', genres);
app.use('/', home);
if (app.get('env') === 'development') {
  app.use(morgan('tiny')); //console logs api requests with express (can write to log file)
  debug('Morgan enabled...');
}

//db work....
debug('Connected to the database....');

//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server:' + config.get('mail.host'));
// console.log('Mail Password:' + config.get('mail.password'));

console.log(`node env: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));