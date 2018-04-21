var mongoose = require("mongoose");
var cheerio = require("cheerio");
var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

var db = require("../models");

router.get('/', function(req, res ) {
	
	db.Article.find({}).populate('note').then(function(dbArticle) {
		console.log(dbArticle);
		var handlebars = {article: dbArticle }
		res.render('index', handlebars );	
	});

	
});


router.get('/scrape', function(req, res) {

	// Make a request call to grab the HTML body from the site of your choice
	request("https://www.bostonglobe.com/", function(error, response, html) {

	  // Load the HTML into cheerio and save it to a variable
	  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
	  var $ = cheerio.load(html);

	  // An empty array to save the data that we'll scrape
	  var results = [];

	  // Select each element in the HTML body from which you want information.
	  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
	  // but be sure to visit the package's npm page to see how it works
		$(".story").each(function(i, element) {

			var link = $(element).find('.story-title').children('a').attr("href");

			// var title = $(element).children('.story-title').text().trim();
			var title = $(element).find('.story-title').find('span').text().trim();
			var summary = $(element).find('.excerpt').children('p').text().trim()
			console.log("LINK: ",link);
			console.log("TITLE: ",title);
			console.log("summary: ",summary);

			if ( summary && title && link ){
				
			// console.log("Title: " + title);
			console.log("Title: " + title);
			console.log("Link: " + link );
			console.log("summary: " + summary );
			

			// Save these results in an object that we'll push into the results array we defined earlier
			db.Article.create({
	          title: title,
	          link: "https://www.bostonglobe.com" + link,
	          summary: summary
	        },function(err, inserted) {
				if (err) {
				// Log the error if one is encountered during the query
					console.log(err);
				}
				else {
				// Otherwise, log the inserted data
					console.log(inserted);
				}
	       	 });
			}//end if

		});	
	res.sendStatus(200);
	});

	// res.sendStatus(200);

});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included

  db.Article.findOne({_id: req.params.id }).populate('note').then(function(dbres) {

    res.redirect('/');

  });

});

// Route for saving/updating an Article's associated Comment
router.post("/article/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note

  db.Comment.create(req.body).then(function(dbComment) {

    return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: {note: dbComment._id }}, {new: true});
  });

	res.sendStatus(200).end();
});

router.post('/comment/delete', function(req, res) {
  console.log(req.body);
    db.Comment.findOneAndRemove({
            _id: req.body
    }).exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			console.log("Note Deleted");
		}
    });
});

module.exports = router;