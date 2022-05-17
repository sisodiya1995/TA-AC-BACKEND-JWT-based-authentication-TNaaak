let mongoose = require('mongoose');
let schema = mongoose.Schema;
let slug = require('mongoose-slug-generator');
let User = require('../models/User');

mongoose.plugin(slug);

let articleSchema = new schema(
  {
    title: { type: String, required: true },
    slug: { type: String, slug: 'title', unique: true },
    description: { type: String },
    body: String,
    tagList: [String],
    favorited: Boolean,
    author: { type: schema.Types.ObjectId, ref: 'User', required: true },
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: schema.Types.ObjectId, ref: 'Comment' }],
    favoriteList: [{ type: schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

articleSchema.methods.displayArticle = function (id = null) {
  return {
    title: this.title,
    slug: this.slug,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: id ? this.favoriteList.includes(id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.displayUser(id),
  };
};
var Article = mongoose.model('Article', articleSchema);
module.exports = Article ;