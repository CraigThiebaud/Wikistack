var express = require('express');
var router = express.Router();
var models = require('../models/');

router.get("/:urlname", function(req, res, next) {
	var url = req.params.urlname;
	models.Page.findOne({
		url_name: url
	}).then(function(page) {
		var versions = page.versions;
		var latestVersion = versions.pop();
		// console.log(latestVersion); 
		models.Page.findOne({
			_id: latestVersion
		}).populate("tags").exec().then(function(latestPage) {
			// console.log(latestPage); 
			res.render('show', {
				orig: page,
				body: latestPage
			})
		})
	});
});

router.get("/:urlname/edit", function(req, res, next) {
	var url = req.params.urlname;
	models.Page.findOne({
		url_name: url
	}).populate("versions").then(function(page) {
		console.log(page.versions[0].date); 
		var versions = page.versions;
		var latestVersion = versions.pop();

		models.Page.findOne({
			_id: latestVersion
		}).populate("tags").exec().then(function(latestPage) {
			res.render('edit', {
				page: latestPage,
				versions: page.versions
			})
		})
	});

})
router.post("/:urlname/edit/submit", function(req, res, next) {
	console.log('============executing============='); 
	var newTitle = req.body['page-title'];
	var newBody = req.body['page-content'];
	var newTags = req.body['page-tags'];
	newTags = newTags.replace(" ", "").split(",");
	var url_name = req.params.urlname;
	console.log(url_name); 

	//find original page 
	models.Page.findOne({
		url_name: url_name
	}).then(function(origPage){
		//create new page for current version
		var page = new models.Page({
			'title': newTitle,
			'body': newBody
		});
		page.save(function(err, result) {
			//when new page is saved update original page versions 
			console.log(origPage._id); 
			models.Page.findByIdAndUpdate(origPage._id, {
				$push: {
					versions: result._id
				},
			}).then(function(err, updateResults) {
				// console.log(updateResults); 
				res.redirect("/wiki/"+url_name);
			});
		});
	});
});
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

module.exports = router;
//deal with new tags
// var promisesArr = newTags.map(function(tag) {
// 	return models.Tag.findOrCreate(tag);
// });
// Promise.all(promisesArr).then(function(foundTags) {
// 	//new tags for original page
// 	var tagsIds = foundTags.map(function(cur) {
// 			return cur._id;
// 		});
// 		// origPage.tags = tagsIds;
// 		//save new page 
// 	page.save(function(err, result) {
// 		//when new page is saved update original page versions 
// 		models.Page.findByIdAndUpdate(origPage._id, {
// 			$push: {
// 				versions: result._id
// 			},
// 			tags:tagsIds
// 		}).then(function(err, updateResults) {
// 			res.redirect('../url_name');
// 		});
// 	});
// });
// })
// });