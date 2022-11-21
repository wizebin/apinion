export function getTypeString(data) {
  const stringType = typeof data;
  if (stringType === 'object') {
    if (data === null) return 'null';
    const stringified = toString.apply(data);
    if (stringified.length > 2 && stringified[0] === '[' && stringified[stringified.length - 1] === ']') {
      const splits = stringified.substr(1, stringified.length - 2).split(' ');
      if (splits.length > 1) {
        return splits.slice(1).join(' ').toLowerCase();
      }
    }
    return 'unknown';
  }

  if (stringType === 'number') {
    if (isNaN(data)) return 'nan';
  }

  return stringType;
}
