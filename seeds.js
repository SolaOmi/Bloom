const mongoose = require("mongoose");
const Writing = require("./models/writings");
const Comment = require("./models/comments");

const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

let data = [
  {
    title: "Node",
    body: LOREM_IPSUM,
    type: "article"
  },
  {
    title: "Apples",
    body: LOREM_IPSUM,
    type: "essay"
  },
  {
    title: "The Great Adventure",
    body: LOREM_IPSUM,
    type: "article"
  }
];

let seedDB = () => {
  // Remove all writings.
  Writing.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("removed writings!");
    Comment.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("removed comments!");
      // Add a few writings.
      data.forEach((seed) => {
        Writing.create(seed, (err, writing) => {
          if (err) {
            console.log(err);
          } else {
            console.log("added a writing");
            // Create a comment
            Comment.create(
              {
                text: "This story is really good!!",
                author: "Foobar jr."
              }, (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  writing.comments.push(comment);
                  writing.save();
                  console.log("Created new comment");
                }
              });
            }
          });
        });
    });
  });
}

module.exports = seedDB;
