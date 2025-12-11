const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
cityId: { type: String, required: true },
name: String,
coords: { lat: Number, lon: Number },
temperature: Number, // Celsius
humidity: Number,
pressure: Number,
aqi: Number,
aqiComponents: Object, // e.g. pm25, pm10, o3
population: Number,
currency: String, // e.g. USD
currencyToINR: Number, // realtime conversion rate
timestamp: { type: Date, default: Date.now }
});

// Keep an index for querying recent entries
MetricSchema.index({ cityId: 1, timestamp: -1 });
module.exports = mongoose.model('CityMetric', MetricSchema);