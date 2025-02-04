import { Context } from 'hono'
import { z } from 'zod'

export const validate = (schema: z.ZodSchema) => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const body = await c.req.json()
      schema.parse(body)
      await next()
    } catch (error) {
      return c.json({ error: 'Invalid request data' }, 400)
    }
  }
} 