var express = require('express');
var Promise = require('bluebird'); //promises module
var router = express.Router();
var models = require('../models/');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('add',{title: 'Add a Page'})
});
router.post('/submit', function(req, res) {
	var title = req.body['page-title']; 
	var body = req.body['page-content']; 
	var tags = req.body['page-tags'];
	tags = tags.replace(" ", "").split(",");
	var url_name = generateUrlName(title); 
	var page = new models.Page({'title':title, 'body':body,'url_name':url_name});
	var promisesArr=tags.map(function(tag){
		return models.Tag.findOrCreate(tag);
	});
	Promise.all(promisesArr).then(function(foundTags){
		// console.log(foundTags); 
		var tagsIds = foundTags.map(function(cur){
			return cur._id;
		})
		page.tags = tagsIds;
		page.save(function(err,result){ 
			// models.Page.update({_id:result._id},
			// 	{$push:{versions:result._id}},
			// 	function(updateError,updateRes){
			// 		res.redirect('/'); 
			// 	});
			// });
		models.Page.findByIdAndUpdate(result._id,
			{$push:{versions:result._id}}
			).then(function(err,updateResults){
				res.redirect('/'); 
			});
		}); 
	});
});
module.exports = router;

var generateUrlName = function(name) {
	if (typeof name != "undefined" && name !== "") {
    // Removes all non-alphanumeric characters from name
    // And make spaces underscore
    return name.replace(/\s/ig, '_').replace(/\W/ig,'');
} else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2,7);
}
};