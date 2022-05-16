var mongoose = require('mongoose');
var schema = mongoose.Schema;

var categorySchema = new schema({
    name : String ,
    bookID :[{type :schema.Types.ObjectId , ref  :'Book'}]
} ,{timestamps : true})

var Category = mongoose.model('Category' ,categorySchema);
module.exports =Category;
