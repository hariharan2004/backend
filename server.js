const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const nftRoutes = require("./nftRoutes");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/nfts", nftRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
