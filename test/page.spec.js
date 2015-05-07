var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
var models = require('../models/index');
var Page = models.Page;
chai.should();
chai.use(require('chai-things'));

describe('Page Model', function() {
	afterEach(function(done) {
		// console.log("destroying page");
		Page.remove({}, done);
	});

	describe('Validations', function() {
		var page
		beforeEach(function() {
			page = new Page()
		})
		it('should err without title', function(done) {
			page.validate(function(err) {
				expect(err.errors).to.have.property('title')
				done()
			})
		})
		it('should err with title of zero length', function(done) {
			page.validate(function(err) {
				expect(err.errors).to.have.property("title");
				done()
			})

		})
		it('should err without body', function(done) {
			page.validate(function(err) {
				expect(err.errors).to.have.property("body");
				done()
			})
		})
	})

	describe('Statics', function() {
		var page;
		beforeEach(function(done) {
			Page.create({
				title: 'foo',
				body: 'bar',
				tags: ['foo', 'bar']
			}, done)
		})
		it('should get pages with the search tag', function(done) {
			Page.findByTag('bar', function(err, pages) {
				expect(pages).to.have.lengthOf(1)
				done()
			})
		})

		it('should not get pages without the search tag', function(done) {
			Page.findByTag('fullstack', function(err, pages) {
				expect(pages).to.have.lengthOf(0)
				done()
			})
		})
	})

	describe('Methods', function() {
		var page1, page2, page3;
		beforeEach(function(done) {
			page1 = new Page({
				body: "page body content",
				title: 'foo',
				tags: ["foo", "bar"]
			});
			page2 = new Page({
				body: "page body content",
				title: 'bar',
				tags: ["bar"]
			});
			page3 = new Page({
				body: "page body content",
				title: 'baz',
				tags: ["baz"]
			});
			Page.create([page1, page2, page3], function(err, results) {
				done();
			})
		})

		describe('computeUrlName', function() {
			it('should convert non-word-like chars to underscores', function(done) {
				var page = new Page({
					title: 'foo*bar'
				})
				page.computeUrlName();
				expect(page.url_name).to.equal('foo_bar');
				done();
			})
		})

		describe('getSimilar', function() {
			it('should never get itself', function(done) {
				page1.getSimilar(function(simErr, simRes) {
					simRes.should.not.contain.a.thing.with.property('title', 'foo');
					done();
				})

			})
			it('should get other pages with any common tags', function(done) {
				page1.getSimilar(function(simErr, simRes) {
					simRes.should.contain.a.thing.with.property('title', 'bar');
					done()
				})
			})
			it('should not get other pages without any common tags', function(done) {
				page1.getSimilar(function(simErr, simRes) {
					simRes.should.not.contain.a.thing.with.property('title', 'baz');
					done()
				})
			})
		})
	})

	describe('Virtuals', function() {
		describe('full_route', function() {
			var page = new Page({
				title: 'foo'
			})
			page.computeUrlName();
			// console.log(page.full_route); 
			it('should return the url_name prepended by "/wiki/"', function(done) {
				expect(page.full_route).to.contain("/wiki/");
				done();
			})
		})
	})

	describe('Hooks', function() {
		afterEach(function(done) {
			Page.remove({}, done);
		});
		it('should call computeUrlName before save', function(done) {
			var page = new Page({
				title: 'foo',
				body: 'foo is better than bar. foo is worse than baz.',
				tags: ["foo", "bar"]
			});
			var spy = chai.spy(page.computeUrlName);
			page.save().then(function(result) {
				expect(spy).to.have.been.called();
			})
			done();
		})
	})
})