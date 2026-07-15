const c = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
}

const time = () => `${c.gray}${new Date().toLocaleTimeString()}${c.reset}`

export const logger = {
  log: (...args: unknown[]) => {
    console.log(`${time()} ${c.blue}[LOG]${c.reset}`, ...args)
  },

  info: (...args: unknown[]) => {
    console.info(`${time()} ${c.green}[INFO]${c.reset}`, ...args)
  },

  warn: (...args: unknown[]) => {
    console.warn(`${time()} ${c.yellow}[WARN]${c.reset}`, ...args)
  },

  error: (...args: unknown[]) => {
    console.error(`${time()} ${c.red}[ERROR]${c.reset}`, ...args)
  },

  dir: (value: unknown, options?: Parameters<typeof console.dir>[1]) => {
    console.log(`${time()} ${c.blue}[DIR]${c.reset}`)
    console.dir(value, options)
  }
}
