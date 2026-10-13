// Dawn (Fajr) and sunset (Maghrib) from the sun's position, computed on the
// phone: no network, no API. Uses the standard low-precision solar coordinates
// (accurate to about a minute this century) and Tunisia's convention for
// dawn: the sun 18° below the horizon. Sunset is the sun's upper edge on the
// horizon (0.833° with refraction).

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fix = (a: number, b: number) => {
  const v = a - b * Math.floor(a / b);
  return v < 0 ? v + b : v;
};

function julianDay(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

/** Sun declination (degrees) and equation of time (hours) at a Julian day. */
function sun(jd: number) {
  const d = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * d, 360);
  const q = fix(280.459 + 0.98564736 * d, 360);
  const l = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * d;
  const ra = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(l)), Math.cos(rad(l)))) / 15, 24);
  return { declination: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(l)))), equation: q / 15 - ra };
}

export interface SunTimes {
  /** Dawn: the fast starts (end of suhoor). */
  fajr: Date;
  sunrise: Date;
  /** Sunset: the fast ends (iftar). */
  maghrib: Date;
}

/**
 * Fajr, sunrise and Maghrib for a calendar day (YYYY-MM-DD) at a place, as
 * absolute moments. Two passes refine each time with the sun's position at
 * that moment rather than at noon.
 */
export function sunTimes(date: string, lat: number, lng: number): SunTimes {
  const [y, m, d] = date.split('-').map(Number);
  const jd = julianDay(y, m, d) - lng / (15 * 24);

  // Hours in UTC.
  const noon = (t: number) => fix(12 - sun(jd + t).equation, 24) - lng / 15;
  const atAngle = (angle: number, t: number, beforeNoon: boolean) => {
    const decl = rad(sun(jd + t).declination);
    const phi = rad(lat);
    const cosH = (-Math.sin(rad(angle)) - Math.sin(decl) * Math.sin(phi)) / (Math.cos(decl) * Math.cos(phi));
    const h = deg(Math.acos(Math.min(1, Math.max(-1, cosH)))) / 15;
    return noon(t) + (beforeNoon ? -h : h);
  };

  let fajr = atAngle(18, 5 / 24, true);
  let sunrise = atAngle(0.833, 6 / 24, true);
  let maghrib = atAngle(0.833, 18 / 24, false);
  for (let i = 0; i < 2; i++) {
    fajr = atAngle(18, (fajr + lng / 15) / 24, true);
    sunrise = atAngle(0.833, (sunrise + lng / 15) / 24, true);
    maghrib = atAngle(0.833, (maghrib + lng / 15) / 24, false);
  }

  const base = Date.UTC(y, m - 1, d);
  // Rounded to the minute, like printed timetables.
  const at = (hours: number) => new Date(base + Math.round(hours * 60) * 60000);
  return { fajr: at(fajr), sunrise: at(sunrise), maghrib: at(maghrib) };
}
