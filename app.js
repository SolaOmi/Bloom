if (process.env.NODE_ENV !== "production") {
  require('dotenv').load();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

let url = process.env.DATABASEURL || process.env.DEVELOPMENTDATABASEURL;
mongoose.connect(url, { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let writingSchema = new mongoose.Schema({
  title: String,
  body: String
});

let Writing = mongoose.model("Writing", writingSchema);

// Writing.create(
//   {
//     title: "Five",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//   }, (err, writing) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("NEWLY CREATED WRITING: ");
//           console.log(writing);
//         }
//   });

app.get("/", (req, res) => res.render("landing"));

app.get("/writings", (req, res) => {
  Writing.find({}, (err, writings) => {
    if (err) {
      console.log(err);
    } else {
      res.render("writings", {writings: writings});
    }
  });
});

app.post("/writings", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let newWriting = {title: title, body: body};

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

app.listen(PORT, () => console.log(`Server is running on port ${ PORT }!`));
