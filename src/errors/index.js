export class SystemError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SystemError';
  }

}

export class JoiValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'joiValidationError';
  }
}


export class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnAuthorizedError";
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

