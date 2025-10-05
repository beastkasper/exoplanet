// Простой тест для проверки работы API
// Запуск: node test-api.js

const API_BASE_URL = "http://localhost:4000/api";

async function testAPI() {
  console.log("🧪 Тестирование NASA Exoplanet API через прокси...\n");

  try {
    // Тест 1: Получение host stars
    console.log("1️⃣ Тестируем /api/host-stars...");
    const hostStarsResponse = await fetch(`${API_BASE_URL}/host-stars`);
    
    if (!hostStarsResponse.ok) {
      throw new Error(`Host stars API failed: ${hostStarsResponse.status}`);
    }
    
    const hostStars = await hostStarsResponse.json();
    console.log(`✅ Получено ${hostStars.length} host stars`);
    console.log(`📋 Первые 5: ${hostStars.slice(0, 5).join(', ')}\n`);

    // Тест 2: Получение exoplanets
    console.log("2️⃣ Тестируем /api/exoplanets...");
    const exoplanetsResponse = await fetch(`${API_BASE_URL}/exoplanets`);
    
    if (!exoplanetsResponse.ok) {
      throw new Error(`Exoplanets API failed: ${exoplanetsResponse.status}`);
    }
    
    const exoplanets = await exoplanetsResponse.json();
    console.log(`✅ Получено ${exoplanets.length} exoplanets`);
    console.log(`📋 Первая планета: ${exoplanets[0]?.pl_name || 'N/A'}\n`);

    // Тест 3: Универсальный NASA TAP запрос
    console.log("3️⃣ Тестируем /api/nasa-tap...");
    const query = "select distinct hostname from ps order by hostname asc";
    const nasaTapUrl = `${API_BASE_URL}/nasa-tap?query=${encodeURIComponent(query)}&format=json`;
    console.log(`🔗 URL: ${nasaTapUrl}`);
    const nasaTapResponse = await fetch(nasaTapUrl);
    
    if (!nasaTapResponse.ok) {
      throw new Error(`NASA TAP API failed: ${nasaTapResponse.status}`);
    }
    
    const nasaTapData = await nasaTapResponse.json();
    console.log(`✅ NASA TAP запрос выполнен успешно`);
    console.log(`📋 Получено ${nasaTapData.length} записей\n`);

    console.log("🎉 Все тесты прошли успешно!");
    console.log("🚀 API готов к использованию в фронтенде");

  } catch (error) {
    console.error("❌ Ошибка при тестировании API:", error.message);
    console.log("\n💡 Убедитесь, что сервер запущен:");
    console.log("   cd server && npm run start:server");
  }
}

// Запускаем тест
testAPI();
