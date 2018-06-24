// Your assignment is to define the routes below. Good luck!

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongojs = require("mongojs");

// Initialize Express
var app = express();

// Configure our app for morgan and body parser
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Static file support with public folder
app.use(express.static("public"));

// Mongojs configuration
var databaseUrl = "warmup";
var collections = ["books"];

// Hook our mongojs config to the db var
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// ======

// TODO: Fill in each route so that the server performs
// the proper mongojs functions for the site to function
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

// Post a book to the mongoose database
app.post("/submit", function(req, res) {
  // Save the request body as an object called book
  var book = req.body;
  // If we want the object to have a boolean value of false,
  // we have to do it here, because the ajax post will convert it
  // to a string instead of a boolean
  book.read = false;
  db.books.insert(book,(err, documents) => {
      if(err)
          res.status(500).json(err);
      else res.json(documents);
  });
});

// Find all books marked as read
app.get("/read", function(req, res) {
  db.books.find({
      read:  true
  }, (err, documents) => {
    if(err)
       res.status(500).json(err);
    else res.json(documents);
  });
});

// Find all books marked as unread
app.get("/unread", function(req, res) {
    db.books.find({
        read: false
    }, (err, documents) => {
        if(err)
            res.status(500).json(err);
        else res.json(documents);
    });
});

// Mark a book as having been read
app.get("/markread/:id", function(req, res) {
  // Remember: when searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IdYouWantToFind))
  db.books.update(
      { _id: mongojs.ObjectId(req.params.id)},
      { $set: {read :true} }
  , (err, documents) => {
      if(err)
          res.status(500).json(err);
      else res.json(documents);
  });
});

// Mark a book as having been not read
app.get("/markunread/:id", function(req, res) {
  // Remember: when searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IdYouWantToFind))
  db.books.update(
      { _id: mongojs.ObjectId(req.params.id)},
      { $set: {read :false} }
  , (err, documents) => {
          if(err)
              res.status(500).json(err);
          else res.json(documents);
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});