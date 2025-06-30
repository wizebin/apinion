import { Request, Response } from 'express';
import { getTypeString } from './getTypeString';

export interface HttpErrorParams {
  status: number;
  message: string;
  data?: any;
}

export class HttpError extends Error {
  status: number;
  data?: any;

  constructor({ status, message, data }: HttpErrorParams) {
    super(message);
    this.name = 'HTTP Error';
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export function stringifyError(error: any): string {
  if (error instanceof Error) {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  } else {
    return JSON.stringify(error);
  }
}

export function applyHttpError(_request: Request, response: Response, error: any): void {
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