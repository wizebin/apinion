import { getTypeString } from './getTypeString';

const startingChars = {
  '{': 'json',
  '[': 'json',
  '<': 'xml',
};

export function parseBody(input) {
  if (!input) return null;
  const inputType = getTypeString(input);
  if (inputType === 'string') {
    const startingType = startingChars[input[0]];
    if (startingType === 'json') {
      try {
        const output = JSON.parse(input);
        return output;
      } catch (err) {
        // not json
      }
    }

    const sections = input.split('&');
    const output = {};
    for (let section of sections) {
      const parts = section.split('=').map(item => decodeURIComponent(item));
      output[parts[0]] = parts[1];
    }
    return output;
  }

  if (inputType === 'array' || inputType === 'object') {
    return input;
  }



  throw new HttpError({ status: 500, message: `issue parsing body, it came in as ${inputType}, but string is the only supported method` })
}
