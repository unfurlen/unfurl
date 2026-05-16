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
  parts[1] = `${row},${col}`;
  return '#' + parts.join(':');
}

export function setSupplies(hash: string, n: number): string {
  const parts = hash.replace(/^#/, '').split(':');
  parts[2] = `${n}`;
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
