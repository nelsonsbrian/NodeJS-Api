const config = require('config'); //allows for config files based on different environments dev/production
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const logger = require('./logger');
app.use(express.json()); //parses req.body into JSON data
app.use(express.urlencoded({ extended: true })); //key=value&ke=value req.body into JSON data
app.use(express.static('public')); //middleware for static folders - serve static content to from root parameter to extact url. localhost:3000/readme.txt
app.use(helmet()); //Help secure Express apps with various HTTP headers 
app.use(logger); //custom middleware in logger.js
if (app.get('env') === 'development') {
  app.use(morgan('tiny')); //console logs api requests with express (can write to log file)
  console.log('Morgan enabled...');
}


//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server:' + config.get('mail.host'));
// console.log('Mail Password:' + config.get('mail.password'));


console.log(`node env: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`)

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);

});




function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}






const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));