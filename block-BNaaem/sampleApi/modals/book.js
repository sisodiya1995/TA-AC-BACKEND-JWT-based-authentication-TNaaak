var mongoose = require("mongoose");
var schema = mongoose.Schema;

var bookSchema = new schema(
  {
    title: String,
    description: String,
    pages: Number,
    commentID: [{ type: schema.Types.ObjectId, ref: "Comment" }],
    category :[{type :schema.Types.ObjectId ,ref :'Category'}],
    tags :[{type : String}]
  },
  { timestamps: true }
);

var Book = mongoose.model("Book", bookSchema);
module.exports = Book;
