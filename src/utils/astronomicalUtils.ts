// Astronomical coordinate conversion function
export function astronomicalToCartesian(
  rightAscension: number, // in hours (0-24)
  declination: number, // in degrees (-90 to 90)
  distance: number = 1 // in parsecs, default to 1 for unit sphere
): { x: number; y: number; z: number } {
  // Convert right ascension from hours to radians
  const raRad = (rightAscension * 15 * Math.PI) / 180; // 15 degrees per hour

  // Convert declination from degrees to radians
  const decRad = (declination * Math.PI) / 180;

  // Convert to Cartesian coordinates
  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.cos(decRad) * Math.sin(raRad);
  const z = distance * Math.sin(decRad);

  return { x, y, z };
}
