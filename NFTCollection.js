const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
    type: String,
    id: Number,
    title: String,
    name: String,
    verified: Boolean,
    staked: Number,
    floor: Number,
    tvl: Number,
    href: String,
    image: String,
  });

  module.exports = mongoose.model("collections", nftSchema);