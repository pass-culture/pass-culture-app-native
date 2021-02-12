export class MonitoringError extends Error {
  constructor(message: string, name = 'MonitoringError') {
    super(message)
    this.name = name
  }
}
