export function parseQueryParams(queryString) {
  const sections = queryString.split('&');
  const output = {};
  for (let section of sections) {
    const parts = section.split('=').map(item => decodeURIComponent(item));
    output[parts[0]] = parts[1];
  }
  return output;
}

export function parseQueryParamsFromUrl(url) {
  const [path, queryString] = url.split('?');
  if (!queryString) return {};
  return parseQueryParams(queryString);
}
