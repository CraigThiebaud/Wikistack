var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var expect = require('chai').expect;
var models = require('../models/index');
var Page = models.Page;



describe('http requests', function() {
	beforeEach(function(done) {
			// console.log("creating page")
			Page.create({
				title: 'foo',
				body: 'bar',
				tags: ['foo', 'bar']
			}, done)
		})
		// delete entries afterwards
	afterEach(function(done) {
		// console.log("destroying page");
		Page.remove({}, done);
	});
	describe('GET /', function() {
		it('should get 200 on index', function(done) {
			agent
				.get('/')
				.expect(200, done)
		})
	})

	describe('GET /wiki/:title', function() {
		it('should get 404 on page that doesnt exist', function(done) {
			agent
				.get('/wiki/fullstackfakepage')
				.expect(404, done)
		})
		it('should get 200 on page that does exist', function(done) {
			agent
				.get('/wiki/foo')
				.expect(200, done)
		})
	})

	describe('GET /wiki/tags/:tag', function() {
		it('should get 200', function(done) {
			agent
				.get('/wiki/tags/foo')
				.expect(200, done)
		})
	})

	describe('GET /wiki/:title/similar', function() {
		it('should get 404 for page that doesn\'t exist', function(done) {
			agent
				.get('/wiki/baz/similar')
				.expect(404,done); 
		})
		it('should get 200 for similar page', function(done) {
			agent
				.get('/wiki/foo/similar')
				.expect(200,done); 
		})
	})

	describe('GET /wiki/:title/edit', function() {
		it('should get 404 on page that doesnt exist', function(done) {
			agent
				.get('/wiki/fullstackfakepage/edit')
				.expect(404, done)
		})
		it('should get 200 for existing page', function(done) {
			agent
				.get('/wiki/foo/edit')
				.expect(200, done)
		})
	})

	describe('GET /add', function() {
		it('should get 200', function(done) {
			agent
				.get('/add')
				.expect(200, done)
		})
	})

	describe('POST /wiki/:title/edit', function() {
		it('should get 404 for page that doesn\'t exist', function(done) {
			agent
				.post('/wiki/fullstackfakepage/edit')
				.expect(404, done)
		})
		it('should update db', function(done) {
			agent
				.post('/wiki/foo/edit')
				.send({
					body: 'someString',
					tags: 'foo1,bar1,baz1'
				}).end(function(error, result) {
					Page.findOne({
						url_name: 'foo'
					}, function(findError, findResults) {
						expect(findResults.body).to.contain('someString');
						done();
					})

				})


		})
	})

	describe('POST /add/submit', function() {
		it('should create in db', function(done) {
			agent
				.post('/add/submit')
				.send({
					title: 'bo',
					body: 'bo page',
					tags: 'bo,bop,bee,borp'

				}).end(function(postErr,postRes){
					done(); 
				})
		})
	})

})