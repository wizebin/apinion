import { getTypeString } from './getTypeString';

export class HttpError {
  constructor({ status, message }) {
    this.name = 'HTTP Error';
    this.status = status;
    this.message = message;
  }
}

export function applyHttpError(request, response, error) {
  const status = error?.status || 500;
  const message = error?.message || 'Uncaught Error Without Message';

  response.status(status);

  console.log(error);

  if (getTypeString(message) === 'object') {
    response.json(message);
  } else if (message) {
    response.json({ message });
  } else {
    const stringified = JSON.stringify(error);
    response.send(stringified);
  }
}
