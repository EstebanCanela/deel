class ApplicationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = ApplicationError;
