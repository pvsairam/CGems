const mongoose = require("mongoose");
let adsSchema = new mongoose.Schema({
  img: String,
  link: String,
});

module.exports = mongoose.model("ads", adsSchema);
