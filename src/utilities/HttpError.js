import { getTypeString } from './getTypeString';

export class HttpError {
  constructor({ status, message, data }) {
    this.name = 'HTTP Error';
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export function stringifyError(error) {
  if (error instanceof Error) {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  } else {
    return JSON.stringify(error);
  }
}

export function applyHttpError(request, response, error) {
  const status = error?.status || 500;
  const message = error?.message || 'Uncaught Error Without Message';
  const data = error?.data || {};

  response.status(status);

  if (getTypeString(message) === 'object') {
    response.json(Object.assign(data, message));
  } else if (message) {
    response.json(Object.assign(data, { message }));
  } else {
    response.send(stringifyError(error));
  }
}
