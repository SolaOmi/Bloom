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
router.post("/", (req, res) => {
  let title = req.body.title;
  let type = req.body.type;
  // preserve line breaks from textarea
  let body = req.body.body.replace(/\n\r?/g, '<br />');
  let newWriting = {title: title, body: body, type: type};

  Writing.create(newWriting, (err, writing) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/writings");
    }
  });
});

// NEW - show form to create new writing
router.get("/new", (req, res) => {
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

module.exports = router;
