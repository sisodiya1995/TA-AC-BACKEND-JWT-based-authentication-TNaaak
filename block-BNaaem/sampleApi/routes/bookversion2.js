var express = require('express');
const Book = require('../modals/book');
var router = express.Router();
var Comment = require('../modals/comment')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("/api/v2/books", (req, res, next) => {
    Book.find({}, (err, books) => {
      if (err) return res.status(500).json(err);
      res.json({ books });
    });
  });

  router.get("/api/v2/books:id", (req, res, next) => {
      var id = req.params.id
    Book.findbyId(id, (err, book) => {
      if (err) return res.status(500).json(err);
      res.json({ book });
    });
  });

  router.post("/api/v2/books", (req, res, next) => {
  Book.create(req.body, (err, addbook) => {
    if (err) return res.status(500).json(err);
    res.json({ addbook });
  });
});

router.put("/api/v2/books:id", (req, res, next) => {
    var id = req.params.id
  Book.findbyIdAndupdate(id, (err, updatebook) => {
    if (err) return res.status(500).json(err);
    res.json({ updatebook});
  });
});

router.delete("/api//v2/books:id", (req, res, next) => {
    var id = req.params.id
  Book.findbyIdAnddelete(id, (err, deletebook) => {
    if (err) return res.status(500).json(err);
    res.json({deletebook});
  });
});


// add comment

router.post("/bookId/comment", (req, res, next) => {
    var bookID = req.params.id;
    req.body.bookID = bookID;
    Comment.create(req.body, (err, addcomment) => {
      if (err) return res.status(500).json(err);
      Book.findByIdAndUpdate(bookID ,{$push :{commentID :addcomment.id}},(err ,book) =>{
        if (err) return res.status(500).json(err);
        res.statusCode(200).json({ addcomment });
      })
     
    });
  });

  // delete comment
  router.get("/comment/:id/delete", (req, res, next) => {
    var id = req.params.id
  Comment.findbyIdAnddelete(id, (err, deletecom) => {
    if (err) return res.status(500).json(err);
    res.json({deletecom});
  });
});

// update comment

router.put("/comment/:id/edit", (req, res, next) => {
    var id = req.params.id
Comment.findbyIdAndupdate(id, (err, updatecom) => {
    if (err) return res.status(500).json(err);
    res.json({ updatecom});
  });
});


// find aall comment
router.get("/comments", (req, res, next) => {
    Comment.find({}, (err, comments) => {
      if (err) return res.status(500).json(err);
      res.json({ comments});
    });
  });
module.exports = router;