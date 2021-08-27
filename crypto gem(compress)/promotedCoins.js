const mongoose = require("mongoose");
let promotedCoinsSchema = new mongoose.Schema({
  name: String,
  img: String,
  address: String,
  chainId: String,
});

module.exports = mongoose.model("promotedCoins", promotedCoinsSchema);
