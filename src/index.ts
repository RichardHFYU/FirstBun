import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db } from './shared/config/database'
import { agents, agentSales, events } from './shared/db/schema'
import { eq } from 'drizzle-orm'
import { template, eventsList, editEventForm } from './shared/views/templates'
import { HTTP_STATUS } from './shared/constants'
import { logger } from './shared/utils/logger'
import { errorHandler } from './shared/utils/error-handler'

const app = new Hono()

app.use('/*', cors())

// Home route
app.get('/', (c) => {
  return c.html(template())
})

// Agent routes
const agentRoutes = new Hono()
agentRoutes.get('/agents', async (c) => {
  try {
    const data = await db.select().from(agents).execute()
    return c.json(data)
  } catch (error) {
    logger.error('Failed to fetch agents', error)
    return c.json({ error: 'Failed to fetch agents' }, HTTP_STATUS.SERVER_ERROR)
  }
})

agentRoutes.get('/agents/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await db
      .select()
      .from(agents)
      .where(eq(agents.agent_id, Number(id)))
      .execute()
    
    if (!result.length) {
      return c.json({ error: 'Agent not found' }, HTTP_STATUS.NOT_FOUND)
    }
    return c.json(result[0])
  } catch (error) {
    logger.error('Failed to fetch agent', error)
    return c.json({ error: 'Failed to fetch agent' }, HTTP_STATUS.SERVER_ERROR)
  }
})

agentRoutes.get('/agents/:id/sales', async (c) => {
  try {
    const id = c.req.param('id')
    const sales = await db
      .select()
      .from(agentSales)
      .where(eq(agentSales.agent_id, Number(id)))
      .execute()
    return c.json(sales)
  } catch (error) {
    logger.error('Failed to fetch agent sales', error)
    return c.json({ error: 'Failed to fetch agent sales' }, HTTP_STATUS.SERVER_ERROR)
  }
})

// Event routes
const eventRoutes = new Hono()

eventRoutes.get('/events', async (c) => {
  try {
    const allEvents = await db.select().from(events).execute()
    return c.html(eventsList(allEvents))
  } catch (error) {
    logger.error('Failed to load events', error)
    return c.text('Failed to load events', HTTP_STATUS.SERVER_ERROR)
  }
})

eventRoutes.post('/events', async (c) => {
  try {
    const body = await c.req.json()
    const [newEvent] = await db.insert(events)
      .values(body)
      .returning()
    
    return c.html(eventsList([newEvent]))
  } catch (error) {
    logger.error('Failed to create event', error)
    return c.text('Failed to create event', HTTP_STATUS.SERVER_ERROR)
  }
})

eventRoutes.get('/events/:id/edit', async (c) => {
  try {
    const id = c.req.param('id')
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .execute()
    
    if (!event) {
      return c.text('Event not found', HTTP_STATUS.NOT_FOUND)
    }
    
    return c.html(editEventForm(event))
  } catch (error) {
    logger.error('Failed to load event', error)
    return c.text('Failed to load event', HTTP_STATUS.SERVER_ERROR)
  }
})

eventRoutes.put('/events/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const [event] = await db
      .update(events)
      .set(body)
      .where(eq(events.id, id))
      .returning()
    
    return c.html(eventsList([event]))
  } catch (error) {
    logger.error('Failed to update event', error)
    return c.text('Failed to update event', HTTP_STATUS.SERVER_ERROR)
  }
})

eventRoutes.delete('/events/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await db.delete(events).where(eq(events.id, id))
    return c.text('') // HTMX will remove the element
  } catch (error) {
    logger.error('Failed to delete event', error)
    return c.text('Failed to delete event', HTTP_STATUS.SERVER_ERROR)
  }
})

// Mount routes with versioning
app.route('/api/v1', agentRoutes)
app.route('/api/v1', eventRoutes)

export default {
  port: 3000,
  fetch: app.fetch,
}
