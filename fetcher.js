// const axios = require("axios");
// const CityMetric = require("./models/CityMetric");

// const CITIES = [
//   {
//     id: "newyork",
//     name: "New York",
//     lat: 40.7128,
//     lon: -74.006,
//     currency: "USD",
//     population: 8468000,
//   },
//   {
//     id: "london",
//     name: "London",
//     lat: 51.5074,
//     lon: -0.1278,
//     currency: "GBP",
//     population: 8982000,
//   },
//   {
//     id: "tokyo",
//     name: "Tokyo",
//     lat: 35.6762,
//     lon: 139.6503,
//     currency: "JPY",
//     population: 13960000,
//   },
//   {
//     id: "mumbai",
//     name: "Mumbai",
//     lat: 19.076,
//     lon: 72.8777,
//     currency: "INR",
//     population: 12440000,
//   },
//   {
//     id: "paris",
//     name: "Paris",
//     lat: 48.8566,
//     lon: 2.3522,
//     currency: "EUR",
//     population: 2148000,
//   },
//   {
//     id: "sydney",
//     name: "Sydney",
//     lat: -33.8688,
//     lon: 151.2093,
//     currency: "AUD",
//     population: 5312000,
//   },
//   {
//     id: "dubai",
//     name: "Dubai",
//     lat: 25.2048,
//     lon: 55.2708,
//     currency: "AED",
//     population: 3331000,
//   },
//   {
//     id: "singapore",
//     name: "Singapore",
//     lat: 1.3521,
//     lon: 103.8198,
//     currency: "SGD",
//     population: 5639000,
//   },
//   {
//     id: "toronto",
//     name: "Toronto",
//     lat: 43.65107,
//     lon: -79.347015,
//     currency: "CAD",
//     population: 2731000,
//   },
//   {
//     id: "berlin",
//     name: "Berlin",
//     lat: 52.52,
//     lon: 13.405,
//     currency: "EUR",
//     population: 3769000,
//   },
// ];

// async function fetchWeather(lat, lon) {
//   const key = process.env.OPENWEATHER_KEY;
//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
//   console.log("url", url);
//   const r = await axios.get(url);
//   console.log("fetchWeather:response", r.data);
//   return r.data;
// }

// async function fetchAQI(lat, lon) {
//   // OpenAQ example (search latest measurements near coords)
//   // const url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=50000`;
//   // const r = await axios.get(url);

//   const key = process.env.OPENAQ_KEY;

//   const url = `https://api.openaq.org/v3/latest?coordinates=${lat},${lon}&radius=50000&limit=1`;

//   const r = await axios.get(url, {
//     headers: {
//       "X-API-Key": key,
//     },
//   });
//   console.log("fetchAQI:response", r);

//   return r.data;
// }

// async function fetchCurrencyToINR(code) {
//   const resp = await axios.get(
//     `https://api.exchangerate.host/latest?base=${code}&symbols=INR`
//   );
//   console.log("fetchCurrencyToINR:response", resp);

//   return resp.data.rates.INR;
// }

// async function fetchAllCityMetrics() {
//   for (const c of CITIES) {
//     try {
//       const w = await fetchWeather(c.lat, c.lon);
//       const a = await fetchAQI(c.lat, c.lon);

//       const rate = await fetchCurrencyToINR(c.currency || "USD");
//       console.log("citymetric:data", w, a, rate);

//       const doc = new CityMetric({
//         cityId: c.id,
//         name: c.name,
//         coords: { lat: c.lat, lon: c.lon },
//         temperature: w.main.temp,
//         humidity: w.main.humidity,
//         pressure: w.main.pressure,
//         aqi:
//           a.results?.[0]?.measurements?.find((m) => m.parameter === "pm25")
//             ?.value ?? null,
//         aqiComponents: a.results?.[0] ?? {},
//         population: c.population || null,
//         currency: c.currency || "USD",
//         currencyToINR: rate,
//         timestamp: new Date(),
//       });
//       console.log("citymetric:doc", doc);

//       await doc.save();
//       return doc;
//     } catch (err) {
//       console.error("fetch error", c.id, err.message);
//       return err;
//     }
//   }
// }

// module.exports = { fetchAllCityMetrics };





const axios = require("axios");
const CityMetric = require("./models/CityMetric");

const CITIES = [
  { id: "newyork", name: "New York", lat: 40.7128, lon: -74.006, currency: "USD", population: 8468000 },
  { id: "london", name: "London", lat: 51.5074, lon: -0.1278, currency: "GBP", population: 8982000 },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503, currency: "JPY", population: 13960000 },
  { id: "mumbai", name: "Mumbai", lat: 19.076, lon: 72.8777, currency: "INR", population: 12440000 },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522, currency: "EUR", population: 2148000 },
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093, currency: "AUD", population: 5312000 },
  { id: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708, currency: "AED", population: 3331000 },
  { id: "singapore", name: "Singapore", lat: 1.3521, lon: 103.8198, currency: "SGD", population: 5639000 },
  { id: "toronto", name: "Toronto", lat: 43.65107, lon: -79.347015, currency: "CAD", population: 2731000 },
  { id: "berlin", name: "Berlin", lat: 52.52, lon: 13.405, currency: "EUR", population: 3769000 },
];

async function fetchWeather(lat, lon) {
  try {
    let key = process.env.OPENWEATHER_KEY;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
    let r = await axios.get(url);
   console.log("fetchWeather:response", r.data);
    return r.data;
  } catch (err) {
    console.error("Weather fetch error:", err.response?.status, err.response?.data || err.message);
    return null;
  }
}

// async function fetchAQI(lat, lon) {
//   try {
//     let key = process.env.OPENAQ_KEY;
//     // let url = `https://api.openaq.org/v3/latest?coordinates=${lat},${lon}&radius=50000&limit=1`;
//     let url ="https://api.openaq.org/v3/locations"
//     let r = await axios.get(url, { headers: { "X-API-Key": key } });
//   console.log("fetchAQI:response", r);
//     return r.data;
//   } catch (err) {
//     console.error("AQI fetch error:", err.response?.status, err.response?.data || err.message);
//     return null;
//   }
// }


async function fetchAQI(lat, lon) {
  try {
    const key = process.env.OPENWEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;
    
    const r = await axios.get(url);
    console.log("fetchAQI:response", r.data);

    // OpenWeather AQI structure: r.data.list[0].main.aqi
    // AQI is 1-5: 1=Good, 5=Very Poor
    const result = r.data.list?.[0] ?? null;
    console.log("fetchAQI:result", result);
    
    return result;
  } catch (err) {
    console.error(
      "AQI fetch error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return null;
  }
}

async function fetchCurrencyToINR(code) {
  try {
    console.log("code", code )
    const key = process.env.EXCHANGE_KEY;
    console.log("url", `https://api.exchangerate.host/latest?access_key=${key}&base=${code}&symbols=INR`)

    const resp = await axios.get(`https://api.exchangerate.host/convert?access_key=${key}&from=${code}&to=INR&amount=1`);
    console.log("fetchCurrencyToINR:response", resp.data);
     return {
      currency: code,
      inrValue: resp.data.result ?? null,
    };
    // return resp.data.result;
  } catch (err) {
    console.error("Currency fetch error:", err.response?.status, err.response?.data || err.message);
    return null;
  }
}

async function fetchAllCityMetrics() {
  for (const c of CITIES) {
    try {
      const w = await fetchWeather(c.lat, c.lon);
      const a = await fetchAQI(c.lat, c.lon);
      const rate = await fetchCurrencyToINR(c.currency || "USD");

      const doc = new CityMetric({
        cityId: c.id,
        name: c.name,
        coords: { lat: c.lat, lon: c.lon },
        temperature: w?.main?.temp ?? null,
        humidity: w?.main?.humidity ?? null,
        pressure: w?.main?.pressure ?? null,
        aqi: a?.main?.aqi ?? null,
        // aqi: a?.results?.[0]?.measurements?.find((m) => m.parameter === "pm25")?.value ?? null,
        aqiComponents: a?.results?.[0]?.measurements ?? [],
        population: c.population || null,
        currency: c.currency || "USD",
        currencyToINR: rate ?? null,
        timestamp: new Date(),
      });

      console.log("Saved city metric:", c.id, doc);
      await doc.save();
    } catch (err) {
      console.error("Overall fetch error for city:", c.id, err.message);
    }
  }
}

module.exports = { fetchAllCityMetrics };
