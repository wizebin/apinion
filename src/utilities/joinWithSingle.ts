function findIndexInDirection(
  string: string,
  predicate: (char: string, index: number) => boolean,
  direction: number = 1
): number | null {
  if (direction > 0) {
    for (let dex = 0; dex < string.length; dex += 1) {
      if (predicate(string[dex], dex)) return dex;
    }
  } else {
    for (let dex = string.length - 1; dex >= 0; dex -= 1) {
      if (predicate(string[dex], dex)) return dex + 1;
    }
  }

  return null;
}

export function joinWithSingle(parts: string[], joiner?: string): string {
  if (!joiner) return parts.join('');

  const cleanedPartArray = parts.map((item, dex) => {
    const firstNonJoiner = dex === 0 ? 0 : findIndexInDirection(item, (letter => (letter !== joiner)), 1);
    const finalNonJoiner = dex === parts.length - 1 ? item.length : findIndexInDirection(item, (letter => letter !== joiner), -1);
    return item.slice(firstNonJoiner || 0, finalNonJoiner || undefined);
  });

  return cleanedPartArray.join(joiner);
}