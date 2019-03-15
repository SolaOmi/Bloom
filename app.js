if (process.env.NODE_ENV !== "production") {
  require('dotenv').load();
}

const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      Writing       = require("./models/writings"),
      Comment       = require("./models/comments"),
      User          = require("./models/user"),
      seedDB        = require("./seeds"),
      PORT          = process.env.PORT || 3000;


let url = process.env.DATABASEURL || process.env.DEVELOPMENTDATABASEURL;
mongoose.connect(url, { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// Fill database with fake seed data.
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => res.render("landing"));

app.get("/writings", (req, res) => {
  Writing.find({}, (err, writings) => {
    if (err) {
      console.log(err);
    } else {
      res.render("writings/index", {writings: writings});
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
  res.render("writings/new");
});

app.get("/writings/:id", (req, res) => {
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

// ------------------------------ COMMENTS ROUTES -------------------

app.get("/writings/:id/comments/new", (req, res) => {
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

app.post("/writings/:id/comments", (req, res) => {
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
          writing.comments.push(comment);
          writing.save();
          res.redirect("/writings/" + writing._id);
        }
      });
    }
  });
});

// ----------------------- AUTH ROUTES -----------------------
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/writings");
      });
    }
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${ PORT }!`));
