let express = require('express');
let router = express.Router();
let Article = require('../models/Article');

//Get Tags
router.get('/', async (req, res, next) => {
  try {
    let tags = await Article.find({}).distinct('tagList');
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
});

//Add Comments to an Article
router.post('/:slug/comments', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: ['Theres is no article for this search'] } });
    }
    req.body.comment.articleId = article.id;
    req.body.comment.author = req.user.userId;
    let comment = await Comment.create(req.body.comment);
    article = await Article.findOneAndUpdate(
      { slug },
      { $push: { comments: comment.id } }
    );
    comment = await Comment.findById(comment.id).populate('author');
    return res
      .status(200)
      .json({ comment: comment.displayComment(req.user.userId) });
  } catch (error) {
    next(error);
  }
});

//Get Comments from an Article
router.get('/:slug/comments', auth.authorizeOpt, async (req, res, next) => {
  let slug = req.params.slug;
  let id = req.user ? req.user.userId : false;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: ['Theres is no article for this search'] } });
    }
    let comments = await Comment.find({ articleId: article.id }).populate(
      'author'
    );
    res.status(200).json({
      comments: comments.map((comment) => {
        return comment.displayComment(id);
      }),
    });
  } catch (error) {
    next(error);
  }
});

//Delete Comments
router.delete(
  '/:slug/comments/:id',
  auth.verifyToken,
  async (req, res, next) => {
    let slug = req.params.slug;
    let id = req.params.id;
    try {
      let article = await Article.findOne({ slug });
      if (!article) {
        return res
          .status(400)
          .json({ errors: { body: ['Theres is no article for this search'] } });
      }
      let comment = await Comment.findById(id);
      if (req.user.userId == comment.author) {
        comment = await Comment.findByIdAndDelete(id);
        article = await Article.findOneAndUpdate(
          { slug },
          { $pull: { comments: id } }
        );
        return res.status(200).json({ msg: 'Comment is successfully deleted' });
      } else {
        return res
          .status(403)
          .json({ error: { body: ['Not Authorized to perform this action'] } });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Favorite Article
router.post('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: ['Theres is no article for this search'] } });
    }
    let user = await User.findById(req.user.userId);
    if (!article.favoriteList.includes(user.id)) {
      article = await Article.findOneAndUpdate(
        { slug },
        { $inc: { favoritesCount: 1 }, $push: { favoriteList: user.id } }
      ).populate('author');
      return res.status(200).json({ article: article.resultArticle(user.id) });
    } else {
      return res.status(200).json({
        errors: { body: ['Article is already added in your favorite list'] },
      });
    }
  } catch (error) {
    next(error);
  }
});

//Unfavorite Article
router.delete('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: ['Theres is no article for this search'] } });
    }
    let user = await User.findById(req.user.userId);
    if (article.favoriteList.includes(user.id)) {
      article = await Article.findOneAndUpdate(
        { slug },
        { $inc: { favoritesCount: -1 }, $pull: { favoriteList: user.id } }
      ).populate('author');

      return res.status(200).json({ article: article.resultArticle(user.id) });
    } else {
      return res.status(200).json({
        errors: { body: ['Article is not added to the favorite list'] },
      });
    }
  } catch (error) {
    next(error);
  }
});
router.get('/tags', async (req, res, next) => {
  try {
    let tags = await Article.find({}).distinct('tagList');
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;