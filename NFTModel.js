const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true },
  owner: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stakeTimestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NFT", NFTSchema);
