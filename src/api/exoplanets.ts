// Базовый URL для локального сервера
const API_BASE_URL = "http://localhost:4000/api";

export async function fetchHostStars(): Promise<string[]> {
  const url = `${API_BASE_URL}/host-stars`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch host stars: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data; // Сервер уже возвращает массив строк
}

export async function fetchExoplanets(): Promise<unknown[]> {
  const url = `${API_BASE_URL}/exoplanets`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch exoplanets: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// Универсальная функция для любых NASA TAP запросов
export async function fetchNASATAPData(query: string, format: string = "json"): Promise<unknown> {
  const url = `${API_BASE_URL}/nasa-tap?query=${encodeURIComponent(query)}&format=${format}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch NASA TAP data: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
