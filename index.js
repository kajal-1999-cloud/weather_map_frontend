require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { fetchAllCityMetrics } = require("./fetcher");
const CityMetric = require("./models/CityMetric");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// GET /api/cities
// app.get("/api/cities", async (req, res) => {
//   const latest = await CityMetric.aggregate([
//     { $sort: { timestamp: -1 } },
//     { $group: { _id: "$cityId", doc: { $first: "$$ROOT" } } },
//     { $replaceRoot: { newRoot: "$doc" } },
//   ]);
//   res.json(latest);
// });

app.get("/api/cities", async (req, res) => {
  try {
    const latest = await CityMetric.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$cityId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
    ]);
    res.json(latest);
  } catch (err) {
    console.error("GET /api/cities error:", err);
    res.status(500).json({ error: "Failed to load cities" });
  }
});


// GET /api/city/:cityId
// app.get("/api/city/:cityId", async (req, res) => {
//   const { cityId } = req.params;
//   const history = await CityMetric.find({ cityId })
//     .sort({ timestamp: 1 })
//     .limit(1000);
//     // console.log("history cidtyid",history)
//   const latest = history[history.length - 1] || null;
//   res.json({ latest, history });
// });


app.get("/api/city/:cityId", async (req, res) => {
  try {
    const { cityId } = req.params;

    const history = await CityMetric.find({ cityId })
      .sort({ timestamp: 1 })
      .limit(1000);

    if (!history.length) {
      return res.status(404).json({ error: "City not found", latest: null });
    }

    const latest = history.at(-1);

    res.json({ latest, history });
  } catch (err) {
    console.error("GET /api/city/:id error:", err);
    res.status(500).json({ error: "Failed to load city details" });
  }
});


// POST /api/refresh
app.post("/api/refresh", async (req, res) => {
  try {
   const result = await fetchAllCityMetrics();
    console.log("fetchAllCityMetrics::result", result)
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start cron: every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("cron: fetching city metrics...");
  try {
    await fetchAllCityMetrics();
  } catch (e) {
    console.error(e);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server listening on", PORT));
