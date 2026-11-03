// Liturgical season and color for the Roman Rite, Ordinary Form, with United States adjustments
// (Epiphany on a Sunday between Jan 2 and Jan 8). Season level only: feasts and memorials
// that change the color for a single day are added with the Today page.
// Simplification: Holy Saturday is shown as violet.

export type LitColor = 'green' | 'violet' | 'white' | 'red' | 'rose';
export interface Season { key: string; label: string; color: LitColor }

const DAY = 86400000;
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d));
const add = (d: Date, n: number) => new Date(d.getTime() + n * DAY);

export function easter(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(year, month - 1, day);
}

function adventStart(year: number): Date {
  const xmas = utc(year, 11, 25);
  const dow = xmas.getUTCDay();
  const advent4 = add(xmas, -(dow === 0 ? 7 : dow));
  return add(advent4, -21);
}

function baptismOfTheLord(year: number): Date {
  // year is the calendar year in which the baptism falls
  const jan2 = utc(year, 0, 2);
  const epiphany = add(jan2, (7 - jan2.getUTCDay()) % 7);
  return epiphany.getUTCDate() >= 7 ? add(epiphany, 1) : add(epiphany, 7);
}

export function seasonFor(input: Date): Season {
  const t = utc(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()).getTime();
  const y = input.getUTCFullYear();
  const E = easter(y).getTime();
  const ash = E - 46 * DAY;
  const advent = adventStart(y).getTime();
  const baptism = baptismOfTheLord(y).getTime();
  const pentecost = E + 49 * DAY;

  if (t >= advent) {
    const gaudete = advent + 14 * DAY;
    if (t < utc(y, 11, 25).getTime()) {
      return t === gaudete
        ? { key: 'advent', label: 'Advent', color: 'rose' }
        : { key: 'advent', label: 'Advent', color: 'violet' };
    }
    return { key: 'christmas', label: 'Christmas', color: 'white' };
  }
  if (t <= baptism) return { key: 'christmas', label: 'Christmas', color: 'white' };
  if (t < ash) return { key: 'ordinary', label: 'Ordinary Time', color: 'green' };
  if (t < E - 3 * DAY) {
    if (t === E - 21 * DAY) return { key: 'lent', label: 'Lent', color: 'rose' };
    if (t === E - 7 * DAY) return { key: 'lent', label: 'Palm Sunday', color: 'red' };
    return { key: 'lent', label: 'Lent', color: 'violet' };
  }
  if (t === E - 3 * DAY) return { key: 'triduum', label: 'Holy Thursday', color: 'white' };
  if (t === E - 2 * DAY) return { key: 'triduum', label: 'Good Friday', color: 'red' };
  if (t === E - 1 * DAY) return { key: 'triduum', label: 'Holy Saturday', color: 'violet' };
  if (t < pentecost) return { key: 'easter', label: 'Easter', color: 'white' };
  if (t === pentecost) return { key: 'easter', label: 'Pentecost', color: 'red' };
  return { key: 'ordinary', label: 'Ordinary Time', color: 'green' };
}

export function seasonForLocalDate(d: Date): Season {
  return seasonFor(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
}
