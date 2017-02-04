/*--------------
Express Routing
--------------*/
var express = require('express');
var app = express();
app.use(express.static('static'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(bodyParser.json());
/*------
MongoDB
------*/
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/todo');
// users collection
var ToDoSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
  title: String,
  content: String,
});
var ToDo = mongoose.model('ToDo', ToDoSchema);
/*-----
Routes
-----*/
// Get static HTML pages
app.get('/',function (req, res) {
  res.render('index');
});
/*---
CRUD
---*/
// Create
app.put('/todo', function (req, res) {
  var n = new ToDo();
  n.title = req.body.title;
  n.content = req.body.content;
  n.save();
  n.save(function(err,todo) {
    console.log('Adds the todo '+todo._id);
    res.status((!err) ? 200 : 500).json((typeof(todo) !== 'undefined') ? todo : {error: true});
  });
});
// Read
app.get('/todos', function (req, res) {
  ToDo.find({}, function(err, todos) {
    console.log('Returns '+todos.length+' todos');
    res.status((!err) ? 200 : 500).json((typeof(todos) !== 'undefined') ? todos : {error: true});
  });
});
// Delete
app.delete('/todo/:id', function (req, res) {
  ToDo.findOneAndRemove({'_id':req.params.id}, function(err, todo){
    console.log('Removes the todo '+todo._id);
    res.status((!err) ? 200 : 500).json((typeof(todo) !== 'undefined') ? todo : {error: true});
  });
});
/*----
Start
----*/
app.listen(3000);
console.log('server.js listens 3000');