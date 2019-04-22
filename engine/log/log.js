export class Logger {
  static info (message) {
    console.log(`[INFO] ${message}`)
  }

  static debug (message) {
    console.log(`[DEBUG] ${message}`)
  }

  static warning (warning) {
    if (warning instanceof Error) {
      if (global.conf.logLevel === 'debug') {
        console.warn(warning)
      } else {
        console.warn(`[WARNING] ${warning.message}`)
      }
    } else {
      console.warn(`[WARNING] ${warning}`)
    }
  }

  static error (error) {
    if (error instanceof Error) {
      if (global.conf.logLevel === 'debug') {
        console.error(error)
      } else {
        console.error(`[ERROR] ${error.message}`)
      }
    } else {
      console.error(`[ERROR] ${error}`)
    }
  }
}
