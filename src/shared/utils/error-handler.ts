export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode }
  }
  return { message: 'Internal Server Error', statusCode: 500 }
} 