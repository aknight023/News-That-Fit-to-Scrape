var express = require("express");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var cheerio = require("cheerio");

// Require all models
var routesModel = require("./controller/routes.js");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Configure middleware
mongoose.connect("mongodb://localhost/newscraper");
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//Created a simple router with express router from the routes.js script
app.use('/', routesModel);


// Start the server
app.listen(PORT, function() {
  console.log("App running on localhost:" + PORT + " !");
});
