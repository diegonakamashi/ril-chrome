export const UNAUTHORIZED_ERROR = 'UnauthorizedError';
export class UnauthorizedError extends Error {
  constructor() {
    super(UNAUTHORIZED_ERROR);
  }
}
