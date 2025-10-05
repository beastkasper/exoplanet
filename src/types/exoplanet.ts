// src/types/exoplanet.ts
export interface Exoplanet {
  pl_name: string;      // Название планеты
  hostname: string;     // Название звезды-хозяина
  ra: number;          // Прямое восхождение (градусы)
  dec: number;         // Склонение (градусы)
  sy_dist: number;     // Расстояние от Земли (парсеки)
  pl_orbper: number;   // Период орбиты (дни)
  pl_rade: number;     // Радиус планеты (в земных радиусах)
  pl_masse: number | null; // Масса планеты (в земных массах)
  pl_eqt: number;      // Равновесная температура (К)
  st_teff: number;     // Эффективная температура звезды (К)
  st_rad: number;      // Радиус звезды (в солнечных радиусах)
  st_mass: number;     // Масса звезды (в солнечных массах)
  disc_year: number;   // Год открытия
}
