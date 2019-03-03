if (process.env.NODE_ENV !== "production") {
  require('dotenv').load();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Writing = require("./models/writings");
const PORT = process.env.PORT || 3000;

let url = process.env.DATABASEURL || process.env.DEVELOPMENTDATABASEURL;
mongoose.connect(url, { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("landing"));

app.get("/writings", (req, res) => {
  Writing.find({}, (err, writings) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {writings: writings});
    }
  });
});

app.post("/writings", (req, res) => {
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

app.get("/writings/new", (req, res) => {
  res.render("new");
});

app.get("/writings/:id", (req, res) => {
  Writing.findById(req.params.id, (err, writing) => {
    if (err || !writing) {
      if (err) {
        console.log(err);
      } else {
        console.log("Writing not found");
      }

      res.redirect("back");
    } else {
      res.render("show", {writing: writing});
    }
  });
})

app.listen(PORT, () => console.log(`Server is running on port ${ PORT }!`));
