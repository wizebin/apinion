import { get, getTypeString } from 'objer';

export class HttpError {
  constructor({ status, message }) {
    this.name = 'HTTP Error';
    this.status = status;
    this.message = message;
  }
}

export function applyHttpError(request, response, error) {
  const status = get(error, 'status') || 500;
  const message = get(error, 'message') || 'Uncaught Error Without Message';

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
