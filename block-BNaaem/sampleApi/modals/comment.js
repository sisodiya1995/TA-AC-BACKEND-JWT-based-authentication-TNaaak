var mongoose = require('mongoose');
var schema = mongoose.Schema;

var commentSchema = new schema({
    title : String ,
    description : String,
    bookID :[{type :schema.Types.ObjectId , ref  :'Book'}]
} ,{timestamps : true})

var Comment = mongoose.model('Comment' ,commentSchema);
module.exports =    Comment;
