if (process.env.NODE_ENV !== "production") {
  require('dotenv').load();
}
const PORT = process.env.PORT || 3000;

const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user"),
      seedDB        = require("./seeds");

// requiring routes
const writingRoutes = require("./routes/writings");
const commentRoutes = require("./routes/comments");
const indexRoutes   = require("./routes/index");

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/writings", writingRoutes);
app.use("/writings/:id/comments", commentRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${ PORT }!`));
