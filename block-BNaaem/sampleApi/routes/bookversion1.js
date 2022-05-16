var express = require('express');
var router = express.Router();
var Book = require('../modals/book')
var Category = require('../modals/categary')
var auth = require('../middlewares/auth')
// Book is modal
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// get all book
// router.get("/", (req, res, next) => {
//     Book.find({}, (err, books) => {
//       if (err) return res.status(500).json(err);
//       res.json({ books });
//     });
//   });

  router.get("/", (req, res, next) => {
    Book.find({}).populate('category').exec((err ,books) => {
      if (err) return res.status(500).json(err);
      res.json({ books });
    })
  });

  router.get("/:id", (req, res, next) => {
      var id = req.params.id
    Book.findbyId(id, (err, book) => {
      if (err) return res.status(500).json(err);
      res.json({ book });
    });
  });


  // create books
  router.post("/",auth.verifytoken, (req, res, next) => {
    let categoryname = req.body.category;
    req.body.category = [];
    let tag = req.body.tags
    req.body.tags = tag;

  Book.create(req.body, (err, addbook) => {
    Category.create({name :categoryname ,bookID: addbook.id},(err ,category) =>{
      if (err) return res.status(500).json(err);
      Book.findbyIdAndupdate(addbook.id,{$push :{category :category.id}},(err ,book) => {
        if (err) return res.status(500).json(err);
        res.json({ book });
      })
    })
    
  });
});

router.put("/:id",auth.verifytoken ,(req, res, next) => {
    var id = req.params.id
  Book.findbyIdAndupdate(id, (err, updatebook) => {
    if (err) return res.status(500).json(err);
    res.json({ updatebook});
  });
});

router.get("/:id/delete", (req, res, next) => {
    var id = req.params.id
  Book.findbyIdAnddelete(id, (err, deletebook) => {
    if (err) return res.status(500).json(err);
    res.json({deletebook});
  });
});


module.exports = router;
