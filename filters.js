module.exports = function(swig) {
  
  var marked = require("marked");  
  var markedFilter = function(body){
    return marked(body)
  }
  markedFilter.safe = true
  swig.setFilter('marked', markedFilter)

  var page_link = function (doc) {
    var link_name;
    if (typeof doc.title !== "undefined" && doc.title !== "") {
      link_name = doc.title
    } else {
      link_name = "Page "+doc.url_name;
      
    }

    return "<a href='"+doc.full_route+"'>"+link_name+"</a>";
  };
  page_link.safe = true;
  swig.setFilter('page_link', page_link);

  var tag_link = function (tag) {
    var link_name;
    if (typeof tag.tagName !== "undefined" && tag.tagName !== "") {
      link_name = tag.tagName
    } else {
      link_name = "tags"+tag.tagName;
      
    }
    return "<a href='"+tag.full_route+"'>"+link_name+"</a>";
  }
  tag_link.safe = true;
  swig.setFilter('tag_link', tag_link);

};