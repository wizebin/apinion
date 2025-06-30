export function parseQueryParams(queryString: string): Record<string, string> {
  const sections = queryString.split('&');
  const output: Record<string, string> = {};
  for (let section of sections) {
    const parts = section.split('=').map((item: string) => decodeURIComponent(item));
    output[parts[0]] = parts[1];
  }
  return output;
}

export function parseQueryParamsFromUrl(url: string): Record<string, string> {
  const [_path, queryString] = url.split('?');
  if (!queryString) return {};
  return parseQueryParams(queryString);
}