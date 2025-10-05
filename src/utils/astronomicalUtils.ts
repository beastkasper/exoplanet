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

// Galactic coordinate system constants (IAU 1958 definition)
const GALACTIC_NORTH_POLE_RA = 192.85948; // Right ascension of galactic north pole (degrees)
const GALACTIC_NORTH_POLE_DEC = 27.12825; // Declination of galactic north pole (degrees)
const GALACTIC_CENTER_LONGITUDE = 266.4047; // Galactic longitude of ascending node (degrees)

// Sun's position in galactic coordinates (IAU standard)
const SUN_GALACTIC_COORDINATES = {
  longitude: 90.0, // degrees
  latitude: 0.0,   // degrees  
  distance: 8.3    // kpc from galactic center
};

// Convert galactic coordinates to Cartesian coordinates
export function galacticToCartesian(
  longitude: number, // galactic longitude in degrees
  latitude: number,  // galactic latitude in degrees
  distance: number   // distance in kpc
): { x: number; y: number; z: number } {
  const lRad = (longitude * Math.PI) / 180;
  const bRad = (latitude * Math.PI) / 180;

  // Convert to galactocentric Cartesian coordinates
  // X points toward galactic center, Y toward galactic rotation, Z toward north pole
  const x = distance * Math.cos(bRad) * Math.cos(lRad);
  const y = distance * Math.cos(bRad) * Math.sin(lRad);
  const z = distance * Math.sin(bRad);

  return { x, y, z };
}

// Get Sun's position in galactocentric coordinates
export function getSunGalacticPosition(): { x: number; y: number; z: number } {
  return galacticToCartesian(
    SUN_GALACTIC_COORDINATES.longitude,
    SUN_GALACTIC_COORDINATES.latitude,
    SUN_GALACTIC_COORDINATES.distance
  );
}

// Convert equatorial coordinates to galactic coordinates
export function equatorialToGalactic(
  ra: number, // right ascension in degrees
  dec: number // declination in degrees
): { l: number; b: number } {
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  
  const raPoleRad = (GALACTIC_NORTH_POLE_RA * Math.PI) / 180;
  const decPoleRad = (GALACTIC_NORTH_POLE_DEC * Math.PI) / 180;
  const l0Rad = (GALACTIC_CENTER_LONGITUDE * Math.PI) / 180;

  // Transformation matrix elements
  const cosDecPole = Math.cos(decPoleRad);
  const sinDecPole = Math.sin(decPoleRad);
  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);
  const cosRADiff = Math.cos(raRad - raPoleRad);

  // Calculate galactic latitude
  const sinB = sinDec * sinDecPole + cosDec * cosDecPole * cosRADiff;
  const b = Math.asin(sinB);

  // Calculate galactic longitude
  const cosB = Math.cos(b);
  const cosL0 = Math.cos(l0Rad - raRad);
  const sinL0 = Math.sin(l0Rad - raRad);
  
  let l = Math.atan2(cosDec * sinL0, sinDec * cosDecPole - cosDec * sinDecPole * cosL0) + l0Rad;
  
  // Normalize longitude to 0-360 degrees
  if (l < 0) l += 2 * Math.PI;
  
  return {
    l: (l * 180) / Math.PI,
    b: (b * 180) / Math.PI
  };
}
