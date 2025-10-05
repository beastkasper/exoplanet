# Решение проблемы CORS для NASA Exoplanet API

## Проблема
Прямое обращение к NASA Exoplanet Archive API с фронтенда вызывает ошибку CORS, так как NASA не разрешает cross-origin запросы.

## Решение
Создан Express сервер-прокси, который:
1. Принимает запросы от фронтенда
2. Перенаправляет их к NASA API
3. Возвращает данные обратно фронтенду

## Запуск

### 1. Запуск сервера
```bash
cd server
npm run start:server
# или
ts-node server.ts
```

Сервер запустится на `http://localhost:4000`

### 2. Запуск фронтенда
```bash
npm run dev
```

Фронтенд запустится на `http://localhost:5173`

## Доступные API эндпоинты

### `/api/host-stars`
Возвращает список всех host stars из NASA базы данных
```javascript
const stars = await fetchHostStars();
console.log(stars); // ['11 Com', '11 UMi', '14 And', ...]
```

### `/api/exoplanets`
Возвращает полные данные об экзопланетах
```javascript
const planets = await fetchExoplanets();
console.log(planets); // [{ pl_name: '...', hostname: '...', ... }, ...]
```

### `/api/nasa-tap`
Универсальный эндпоинт для любых NASA TAP запросов
```javascript
const data = await fetchNASATAPData(
  'select distinct hostname from ps order by hostname asc',
  'json'
);
```

## Тестирование

1. Убедитесь, что сервер запущен на порту 4000
2. Откройте фронтенд в браузере
3. Проверьте консоль браузера - должны появиться данные о host stars и exoplanets
4. Проверьте Network tab - запросы должны идти на `localhost:4000/api/*`

## Структура данных

### Host Stars
Массив строк с названиями звезд:
```json
["11 Com", "11 UMi", "14 And", "14 Her", ...]
```

### Exoplanets
Массив объектов с данными об экзопланетах:
```json
[
  {
    "pl_name": "11 Com b",
    "hostname": "11 Com",
    "ra": 185.1791667,
    "dec": 17.7927778,
    "sy_dist": 110.62,
    "pl_orbper": 326.03,
    "pl_rade": 1.2,
    "pl_masse": 19.4,
    "pl_eqt": 323,
    "st_teff": 4742,
    "st_rad": 19.0,
    "st_mass": 2.7,
    "disc_year": 2008
  },
  ...
]
```

## Преимущества решения

1. **Обход CORS** - сервер работает как прокси
2. **Кэширование** - можно добавить кэширование на сервере
3. **Обработка ошибок** - централизованная обработка ошибок API
4. **Безопасность** - API ключи (если понадобятся) остаются на сервере
5. **Гибкость** - можно добавлять дополнительные эндпоинты

## Возможные улучшения

1. Добавить кэширование данных
2. Добавить rate limiting
3. Добавить логирование запросов
4. Добавить валидацию входных параметров
5. Добавить API ключи для NASA (если потребуется)
