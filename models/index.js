var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Schema = mongoose.Schema; 

var pageSchema = new mongoose.Schema({
  title:    String,
  url_name: String,
  owner_id: String,
  body:     String,
  date:     { type: Date, default: Date.now },
  status:   Number,
  tags:     [{type: Schema.Types.ObjectId, ref: 'Tag'}]
});

pageSchema.virtual('full_route').get(function(){
  return "/wiki/" + this.url_name;
})

var tagSchema = new mongoose.Schema({
  tagName:  String,
})
tagSchema.statics.findOrCreate=function(tagName){
  var self = this; 
  return self.findOne({tagName:tagName}).exec().then(function(found){
    if(!found){
      return self.create({tagName:tagName});
    }else{
      return found; 
    }
  })

}
tagSchema.virtual('full_route').get(function(){
  return "/tags/" + this.tagName;
})

var userSchema = new mongoose.Schema({
  name:  { first: String, last: String },
  email: String
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);
var Tag = mongoose.model('Tag',tagSchema);
module.exports = {
  Page: Page,
  User: User,
  Tag: Tag
};