var express = require('express');
var router = express.Router();
var models = require('../models/');
/* GET home page. */
router.get('/', function(req, res, next) {
	models.Page.find(function(err,result){
		res.render('index',{title:'BROWSE MY WIKISTACK',docs:result});
		// res.render('index', { title: 'BROWSE MY WIKISTACK' ,pages:pages});
	});
});

router.get("/wiki/:urlname",function(req,res, next){
	var url = req.params.urlname;
	models.Page.findOne({url_name:url}).populate("tags").exec().then(function(page){
		
		res.render('show', {body: page})
	});
	// models.Page.findOne({ url_name: url }, function(err,result){
	// 	result.populate("tags").exec().then(function(tags){
	// 		console.log(tags); 
	// 	}); 
	// 	res.render('show', {body: result})
	// });
});

module.exports = router;
