const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const path = require("path");
const { send } = require("process");
const airdrop = require("./airdrop");
const ads = require("./ads");
const promotedCoins = require("./promotedCoins");
const app = express();
const PORT = process.env.PORT || 5000;
const connctionUrl =
  "mongodb+srv://admin:4Q6nhmYrwoChomAk@cluster0.oy4m1.mongodb.net/crpytoGems?retryWrites=true&w=majority";

mongoose.connect(connctionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/contact.html"));
});

app.get("/airdrop", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/airdrop.html"));
});

app.get("/address", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/data.html"));
});

app.get("/transaction", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/transaction.html"));
});

app.post("/data/airdrop", (req, res) => {
  const airdropdb = req.body;

  airdrop.create(airdropdb, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.get("/data/airdrop", (req, res) => {
  airdrop.find({}, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.send(data);
  });
});

app.get("/data/ads", (req, res) => {
  ads.find({}, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.send(data);
  });
});

app.post("/data/coins", (req, res) => {
  const promotedCoinsdb = req.body;

  promotedCoins.create(promotedCoinsdb, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.get("/data/coins", (req, res) => {
  promotedCoins.find({}, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.send(data);
  });
});

app.listen(PORT);
