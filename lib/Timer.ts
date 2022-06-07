export class Timer {
  private readonly start: number

  constructor() {
    this.start = Date.now()
  }

  stop(): number {
    return Date.now() - this.start
  }
}
