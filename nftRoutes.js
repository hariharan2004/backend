const express = require("express");
const NFT = require("./NFTModel");
const router = express.Router();
const collections = require("./NFTCollection");
// Fetch Staked NFTs for a User
router.get("/collections", async (req, res) => {
  try {
    const nfts = await collections.find();
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
router.get("/collections/:href", async (req, res) => {
  try {
    const { href } = req.params;

    if (!href) {
      return res.status(400).json({ error: "Missing href parameter" });
    }

    // Try finding with or without the leading slash
    const collection = await Collection.findOne({
      $or: [{ href: href }, { href: `/${href}` }],
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/staked-nfts/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const nfts = await NFT.find({ owner: wallet });
    const now = Date.now();

    const updatedNFTs = nfts.map(nft => {
      const stakeTimestamp = new Date(nft.stakeTimestamp).getTime();
      const unlockTimestamp = stakeTimestamp + 28 * 24 * 60 * 60 * 1000; // 28 days limit
      let remainingTime = Math.max(0, Math.floor((unlockTimestamp - now) / 1000)); // in seconds

      return { ...nft, remainingTime };
    });

    res.json(updatedNFTs);
  } catch (error) {
    console.error("Error fetching staked NFTs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Stake NFT
router.post("/stake", async (req, res) => {
  try {
    const { tokenId, owner, imageUrl } = req.body;
    const nft = new NFT({ tokenId, owner: owner.toLowerCase(), imageUrl });
    await nft.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error staking NFT:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Unstake NFT (Checks time before unstaking)
router.post("/unstake", async (req, res) => {
  try {
    const { tokenId, owner } = req.body;
    const nft = await NFT.findOne({ tokenId, owner: owner.toLowerCase() });

    if (!nft) return res.status(404).json({ error: "NFT not found" });

    const now = new Date();
    const elapsedDays = (now - new Date(nft.stakeTimestamp)) / (1000 * 60 * 60 * 24);

    if (elapsedDays < 28) {
      return res.status(400).json({ error: "28 days required before unstaking" });
    }

    await NFT.deleteOne({ tokenId, owner });
    res.json({ success: true });
  } catch (error) {
    console.error("Error unstaking NFT:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
