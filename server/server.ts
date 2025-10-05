// server.ts
import express from "express";
import fetch from "node-fetch"; // npm install node-fetch
import cors from "cors"; // npm install cors

const app = express();
const PORT = 4000;

app.use(cors()); // чтобы React мог обращаться
app.use(express.json());

// Эндпоинт для получения списка всех планет с координатами и параметрами
app.get("/api/exoplanets", async (req, res) => {
  try {
    const url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,ra,dec,sy_dist,pl_orbper,pl_rade,pl_masse,pl_eqt,st_teff,st_rad,st_mass,disc_year+from+pscomppars&format=json";
    console.log("Fetching exoplanets from:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NASA API error response: ${response.status} - ${errorText}`);
      throw new Error(`NASA API responded with status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 'non-array'} exoplanets`);
    res.json(data);
  } catch (err) {
    console.error("Error fetching exoplanets:", err);
    res.status(500).json({ error: "Failed to fetch NASA data", details: err.message });
  }
});

// Новый эндпоинт для получения списка host stars
app.get("/api/host-stars", async (req, res) => {
  try {
    const url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct+hostname+from+ps+order+by+hostname+asc&format=json";
    console.log("Fetching host stars from:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NASA API error response: ${response.status} - ${errorText}`);
      throw new Error(`NASA API responded with status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 'non-array'} host star records`);
    
    // NASA TAP JSON возвращает массив объектов с ключом 'hostname'
    const hostStars = data.map((item: { hostname: string }) => item.hostname);
    console.log(`Processed ${hostStars.length} host stars`);
    
    res.json(hostStars);
  } catch (err) {
    console.error("Error fetching host stars:", err);
    res.status(500).json({ error: "Failed to fetch host stars from NASA API", details: err.message });
  }
});

// Универсальный эндпоинт для любых NASA TAP запросов
app.get("/api/nasa-tap", async (req, res) => {
  try {
    const { query, format = "json" } = req.query;
    
    if (!query) {
      console.log("NASA TAP: Missing query parameter");
      return res.status(400).json({ error: "Query parameter is required" });
    }
    
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query as string)}&format=${format}`;
    console.log("NASA TAP URL:", url);
    console.log("NASA TAP Query:", query);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NASA API error response: ${response.status} - ${errorText}`);
      throw new Error(`NASA API responded with status: ${response.status} - ${errorText}`);
    }
    
    // Проверяем content-type для правильной обработки
    const contentType = response.headers.get('content-type');
    console.log("NASA TAP Content-Type:", contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`NASA TAP: Successfully fetched ${Array.isArray(data) ? data.length : 'non-array'} records`);
      res.json(data);
    } else {
      // Если не JSON, возвращаем как текст
      const text = await response.text();
      console.log("NASA TAP: Returning non-JSON response");
      res.json({ data: text, format: format });
    }
  } catch (err) {
    console.error("Error fetching NASA TAP data:", err);
    res.status(500).json({ error: "Failed to fetch data from NASA TAP API", details: err.message });
  }
});

app.listen(PORT,'83.217.222.42', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /api/exoplanets - Get exoplanet data`);
  console.log(`  GET /api/host-stars - Get host star names`);
  console.log(`  GET /api/nasa-tap?query=<query>&format=<format> - Universal NASA TAP proxy`);
});
