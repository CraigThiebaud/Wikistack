var express = require('express');
var router = express.Router();
var models  = require('../models/')


router.get('/', function(req, res, next) {
	models.Tag.find().then(function(Tag){
		res.render("showTag", {title: "Tags", Tags: Tag})
	})  
});

router.get('/:tag', function(req,res,next){
	var searchTag = req.params.tag;
	models.Tag.findOne({tagName: searchTag}).then(function(foundTag){
		var tagId = foundTag._id
		// console.log(foundTag)
		models.Page.find({tags:{$elemMatch: { $eq: tagId} } }).exec(function(err,pages){
			console.log(pages)
		})
	})
})

module.exports = router;