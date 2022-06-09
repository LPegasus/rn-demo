export class FetchError extends Error {
  constructor(public statusCode: number, public errMsg: string) {
    super(errMsg);
  }
}
