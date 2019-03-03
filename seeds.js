const mongoose = require("mongoose");
const Writing = require("./models/writings");

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

    // Add a few writings.
    data.forEach((seed) => {
      Writing.create(seed, (err, writing) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added a writing");
        }
      });
    })
  });
}

module.exports = seedDB;
