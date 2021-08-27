const mongoose = require("mongoose");
let airdropSchema = new mongoose.Schema({
  img: String,
  body: Array,
  date: String,
});

module.exports = mongoose.model("airdrop", airdropSchema);
