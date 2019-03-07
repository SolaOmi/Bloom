const mongoose = require("mongoose");

let writingSchema = new mongoose.Schema({
  title: String,
  type: String,
  body: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Writing", writingSchema);
