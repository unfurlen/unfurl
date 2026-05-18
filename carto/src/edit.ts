export function cycleTileBiome(hash: string, row: number, col: number): string {
  const parts = hash.replace(/^#/, '').split(':');
  const rows = parts[0].split(',');
  if (row < 0 || row >= rows.length || col < 0 || col >= rows[row].length) {
    throw new RangeError(`Tile (${row}, ${col}) out of bounds`);
  }
  const chars = rows[row].split('');
  const cycle: Record<string, string> = { F: 'W', W: 'M', M: 'F' };
  chars[col] = cycle[chars[col]] ?? chars[col];
  rows[row] = chars.join('');
  parts[0] = rows.join(',');
  return '#' + parts.join(':');
}

export function setPlayerStart(hash: string, row: number, col: number): string {
  const parts = hash.replace(/^#/, '').split(':');
  const rows = parts[0].split(',');
  if (row < 0 || row >= rows.length || col < 0 || col >= rows[0].length) {
    throw new RangeError(`Tile (${row}, ${col}) out of bounds`);
  }
  parts[1] = `${row},${col}`;
  return '#' + parts.join(':');
}

export function setSupplies(hash: string, n: number): string {
  if (n < 1) throw new RangeError('Supplies must be >= 1');
  const parts = hash.replace(/^#/, '').split(':');
  parts[2] = `${n}`;
  return '#' + parts.join(':');
}

export function setWidth(hash: string, n: number): string {
  if (n < 1 || n > 99) throw new RangeError('Width must be between 1 and 99');
  const parts = hash.replace(/^#/, '').split(':');
  const rows = parts[0].split(',');
  parts[0] = rows.map(r => n > r.length ? r + 'F'.repeat(n - r.length) : r.slice(0, n)).join(',');
  parts[1] = '0,0';
  return '#' + parts.join(':');
}

export function setHeight(hash: string, n: number): string {
  if (n < 1 || n > 99) throw new RangeError('Height must be between 1 and 99');
  const parts = hash.replace(/^#/, '').split(':');
  const rows = parts[0].split(',');
  const w = rows[0].length;
  if (n > rows.length) while (rows.length < n) rows.push('F'.repeat(w));
  else rows.length = n;
  parts[0] = rows.join(',');
  parts[1] = '0,0';
  return '#' + parts.join(':');
}

export function toggleEditMode(hash: string): string {
  const parts = hash.replace(/^#/, '').split(':');
  if (parts[parts.length - 1] === 'e') {
    if (parts[parts.length - 2] === '') {
      parts.splice(-2);
    } else {
      parts.pop();
    }
  } else {
    parts.length = 4;
    parts.push('', 'e');
  }
  return '#' + parts.join(':');
}
