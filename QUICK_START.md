# 🚀 Быстрый запуск Exoplanets проекта

## ✅ Проблема CORS решена!

Теперь вы можете получать данные из NASA Exoplanet Archive без проблем с CORS.

## 🏃‍♂️ Запуск проекта

### 1. Установка зависимостей (если еще не установлены)
```bash
npm install
```

### 2. Запуск сервера (в отдельном терминале)
```bash
npm run start:server
```
Сервер запустится на `http://localhost:4000`

### 3. Запуск фронтенда (в другом терминале)
```bash
npm run dev
```
Фронтенд запустится на `http://localhost:5173`

### 4. Тестирование API
```bash
node test-api.js
```

## 📊 Доступные данные

- **4,495 host stars** - звезды с экзопланетами
- **6,022 exoplanets** - полные данные об экзопланетах
- **Универсальный NASA TAP API** - для любых запросов к NASA

## 🔗 API эндпоинты

- `GET /api/host-stars` - список звезд
- `GET /api/exoplanets` - данные об экзопланетах
- `GET /api/nasa-tap?query=<query>&format=<format>` - универсальный запрос

## 🎯 Что работает

✅ Обход CORS ограничений  
✅ Получение реальных данных из NASA  
✅ 3D визуализация экзопланет  
✅ Интерактивные компоненты  
✅ TypeScript типизация  

## 🐛 Если что-то не работает

1. Убедитесь, что сервер запущен на порту 4000
2. Проверьте, что фронтенд запущен на порту 5173
3. Запустите `node test-api.js` для диагностики API
4. Проверьте консоль браузера на ошибки

## 📝 Примеры использования

```javascript
// Получение host stars
import { fetchHostStars } from './api/exoplanets';
const stars = await fetchHostStars();

// Получение exoplanets
import { fetchExoplanets } from './api/exoplanets';
const planets = await fetchExoplanets();

// Универсальный NASA TAP запрос
import { fetchNASATAPData } from './api/exoplanets';
const data = await fetchNASATAPData('select * from ps where pl_rade > 2');
```

🎉 **Готово! Теперь вы можете исследовать экзопланеты!**
