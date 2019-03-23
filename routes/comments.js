const express = require("express");
const router = express.Router({mergeParams: true});
const Writing = require("../models/writings");
const Comment = require("../models/comments");

// Comments New
router.get("/new", isLoggedIn, (req, res) => {
  Writing.findById(req.params.id, (err, writing) => {
    if (err || !writing) {
      if (err) {
        console.log(err);
      } else {
        console.log("Writing not found");
      }
    } else {
      res.render("comments/new", {writing: writing});
    }
  });
});

// Comments Create
router.post("/", isLoggedIn, (req, res) => {
  Writing.findById(req.params.id, (err, writing) => {
    if (err || !writing) {
      if (err) {
        console.log(err);
      } else {
        console.log("Writing not found");
      }
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          
          writing.comments.push(comment);
          writing.save();
          res.redirect("/writings/" + writing._id);
        }
      });
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
