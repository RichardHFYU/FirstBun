export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }))
  },
  error: (message: string, error?: unknown) => {
    console.error(JSON.stringify({ level: 'error', message, error }))
  }
} 