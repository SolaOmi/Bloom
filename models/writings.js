const mongoose = require("mongoose");

let writingSchema = new mongoose.Schema({
  title: String,
  type: String,
  body: String
});

module.exports = mongoose.model("Writing", writingSchema);
