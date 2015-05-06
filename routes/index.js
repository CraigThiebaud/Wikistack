var express = require('express');
var router = express.Router();
var models = require('../models/');
/* GET home page. */
router.get('/', function(req, res, next) {
	//find pages that dont have an empty versions array 
	models.Page.find({$where:"this.versions.length>0"},function(err, result) {
		res.render('index', {
			title: 'BROWSE MY WIKISTACK',
			docs: result
		});
		// res.render('index', { title: 'BROWSE MY WIKISTACK' ,pages:pages});
	});
});




module.exports = router;