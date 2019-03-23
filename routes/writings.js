const express = require("express");
const router = express.Router();
const Writing = require("../models/writings")

// INDEX - show all writings
router.get("/", (req, res) => {
  Writing.find({}, (err, writings) => {
    if (err) {
      console.log(err);
    } else {
      res.render("writings/index", {writings: writings});
    }
  });
});

// CREATE - add new writing to DB
router.post("/", isLoggedIn, (req, res) => {
  let title = req.body.title;
  let type = req.body.type;
  // preserve line breaks from textarea
  let body = req.body.body.replace(/\n\r?/g, '<br />');
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newWriting = {title: title, body: body, type: type, author: author};

  Writing.create(newWriting, (err, writing) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/writings");
    }
  });
});

// NEW - show form to create new writing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("writings/new");
});

// SHOW - shows more info about one writing
router.get("/:id", (req, res) => {
  Writing.findById(req.params.id).populate("comments").exec((err, writing) => {
    if (err || !writing) {
      if (err) {
        console.log(err);
      } else {
        console.log("Writing not found");
      }

      res.redirect("back");
    } else {
      res.render("writings/show", {writing: writing});
    }
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
